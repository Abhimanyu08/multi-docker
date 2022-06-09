import React, { useState, useEffect} from 'react'
import axios from 'axios';

function Fib() {

    const [inp, setInp] = useState();
    const [seen, setSeen] = useState();
    const [dict, setDict] = useState();

    useEffect(() => {
        fetchAll();
        fetchDict();
    }, [])

    const fetchDict= async () => {
        console.log("fetch res called");
        const res = await axios.get('/api/values/current' 
        );
        
        setDict(res.data);
    }
    const fetchAll = async () => {
        const res = await axios.get('/api/values/all');
        setSeen(res.data)
    }

    const onSubmit = async (e) => {
        await axios.post("/api/values", { index: inp });
        setInp('');
    }

    return (
        <div>
            <input type="number" onChange={(e) => setInp(e.target.value)} value={inp}/> 
            <button onClick={onSubmit}>Submit</button>
            <h3>Seen Inputs</h3>
            {dict ? 
            Object.keys(dict).map((k) => {
                return (

                    <p>{k}- {dict[k] || "null"}</p>
                )
            }): <></>}

        </div>
    )
}

export default Fib