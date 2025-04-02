
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors())
app.use(express.json())
app.use(express.static('kepek'))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'muveszeti_kiallitas'
});

connection.connect(err => {
  if (err) {
    console.error('Adatbázis csatlakozási hiba!', err);
    return;
  }
  console.log('Sikeres csatlakozás az adatbázishoz!');
});

// /muveszFelvitel
app.post('/muveszFelvitel', (req, res) => {
  const { nev, nemzetiseg } = req.body;
  console.log(nev, nemzetiseg);

  const sql = 'INSERT INTO muvesz (id, nev, nemzetiseg, aktiv) VALUES (NULL, ?, ?, "1");';
  connection.query(sql, [nev, nemzetiseg], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Hiba a felvétel során ', err })
    }
    console.log(result);

    return res.status(201).json({ message: 'Sikeres felvétel', insertedID: result.insertId });
  });
});

// /alkotasFelvitel
app.post('/alkotasFelvitel', (req, res) => {
  const { muvesz_id, cim, ev } = req.body;
  console.log(muvesz_id, cim, ev);

  const sql = 'INSERT INTO alkotas (id, muvesz_id, cim, ev) VALUES (NULL, ?, ? ,?);';
  connection.query(sql, [muvesz_id, cim, ev], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Hiba a felvétel során ', err })
    }
    console.log(result);

    return res.status(201).json({ message: 'Sikeres felvétel', insertedID: result.insertId });
  })
});

// /muveszAlkotasai/:muvesz_id
app.get('/muveszAlkotasai/:muvesz_id', (req, res)=> {
  const { muvesz_id } = req.params;
  console.log(muvesz_id);
  
  const sql = 'SELECT * FROM alkotas WHERE muvesz_id = ? ORDER BY ev';

  connection.query(sql, [muvesz_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Hiba a felvétel során ', err })
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "A művésztől nem található talkotás" })
    }

    return res.status(200).json(result);
  })
})

// /alkotasTorles/:id
app.delete('/alkotasTorles/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);

  const sql = 'DELETE FROM alkotas WHERE id = ?';
  
  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Hiba a törlés során ', err })
    }

    return res.status(200).json({ message: 'Sikeres törlés' });
  })
});

// /alkotasokMuveszNevekkel
app.get('/alkotasokMuveszNevekkel', (req, res) => {
  const sql = 'SELECT * FROM alkotas JOIN muvesz ON alkotas.muvesz_id = muvesz.id';

  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Hiba a lekérdezés során', err })
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Nincs találat" })
    }

    return res.status(200).json(result);
  });
})

app.listen(3000, () => {
  console.log('Szerver fut a 3000-es porton');
});