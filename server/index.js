import { createClient } from 'redis';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import express from 'express';

(async () => {
    const client = createClient({
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            reconnectStrategy: () => 1000,
        }
    });
    client.on("error", (err) => console.error("error in redis client"));
    await client.connect();


    const publisher= client.duplicate();
    await publisher.connect();

    const app = express();
    
    app.use(cors());
    app.use(bodyParser.json());

    const { Pool } = pkg;
    const pgClient = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
    });

    await pgClient.connect().then((client) => {
        client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    }).catch((err) => console.error(err));

    app.get('/', (req, res) => {
        res.send("hi");
    });

    app.get('/values/all', async (req, res) => {
        const values = await pgClient.query("SELECT * FROM values");
        res.send(values.rows);
    });

    app.get('/values/current', async (req, res) => {
        
        const values = await client.hGetAll("values");
        res.send(values);
    });

    app.post('/values', (req, res) => {
        const val = parseInt(req.body.index);

        if (val > 40) {
            return res.status(422).send("Too high input");
        }

        client.hSet("values", req.body.index, "null");
        publisher.publish("message", req.body.index);
        pgClient.query("INSERT INTO values(number) VALUES ($1)", [req.body.index]);
        res.send("hi");
    });

    app.listen(5000, (err) => {
        console.log("listening on 5000");
    });
})();





