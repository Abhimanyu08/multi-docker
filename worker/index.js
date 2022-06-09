import { createClient } from "redis";

(async () => {
    const client = createClient({
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            reconnectStrategy: () => 1000
        },
    });

    client.on("error", (err) => console.error("error in redis client"));
    await client.connect();


    const subscriber = client.duplicate();
    await subscriber.connect();

    const fib = (n) => {
        if (n < 2) {
            return 1;
        }
        return fib(n-1) + fib(n-2)
    }

    // subscriber.on("message", (channel, message) => {
    //     console.log("hey")
    // });
    
    subscriber.subscribe("message", (message) => {
        client.hSet("values", parseInt(message), fib(parseInt(message)));
    });

})();




