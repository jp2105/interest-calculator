import { Button, Chip, Container, TextField } from '@material-ui/core'
import React, { useState } from 'react'

function RandomChoice() {
    const [txt, setTxt] = useState("");
    const [randomArr, setRandomArr] = useState([])
    const handleBtn = () => {
        if (txt) {
            let temp = [...randomArr];
            temp.push(txt);
            setRandomArr(temp)
            setTxt("")
        }
    }
    const handleDelete = (e) => {
        let temp = [...randomArr];
        temp.splice(temp.indexOf(e), 1);
        setRandomArr(temp)
    }
    const handleRandom = () => {
        if (randomArr.length >= 2) {
            let temp = Math.floor(Math.random() * (randomArr.length));
            alert(randomArr[temp])
        }
    }
    return (
        <Container maxWidth="sm" >
            <div style={{ padding: 5 }}>
                <TextField
                    type='text'
                    value={txt}
                    onChange={(t) => setTxt(t.target.value)}
                    id="outlined-basic"
                    label="Random things"
                    variant="outlined"
                ></TextField>
                <Button onClick={handleBtn}>Add</Button>
                <Button onClick={handleRandom}>Random Answer</Button>
                <div>
                    {
                        randomArr.length > 0 &&
                        randomArr.map((item, index) => {
                            return <Chip
                                label={item}
                                variant="outlined"
                                key={item + index}
                                onDelete={() => handleDelete(item)}
                                style={{ margin: 2 }}
                            />
                        })
                    }
                </div>
            </div>
        </Container>
    )
}

export default RandomChoice