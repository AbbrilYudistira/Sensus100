const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const QUESTIONS_FILE = './questions.json';

app.use(express.static('public'));

let questions;
if (fs.existsSync(QUESTIONS_FILE)) {
    questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
} else {
    questions = [
        {
            question: "Sebutkan data BPS yang paling sering dicari oleh Mahasiswa untuk Skripsi!",
            answers: [
                { text: "Tingkat Kemiskinan", points: 45 },
                { text: "Pertumbuhan Ekonomi / PDB", points: 25 },
                { text: "Jumlah Penduduk", points: 15 },
                { text: "Tingkat Pengangguran", points: 10 },
                { text: "Data Inflasi", points: 5 }
            ]
        },
        {
            question: "Benda apa yang biasanya WAJIB dibawa oleh petugas pencacah survei BPS ke lapangan?",
            answers: [
                { text: "Kuesioner / Kertas", points: 40 },
                { text: "HP / Tablet / Gadget", points: 30 },
                { text: "Rompi Petugas BPS", points: 15 },
                { text: "Surat Tugas", points: 10 },
                { text: "Pena / Alat Tulis", points: 5 }
            ]
        }
    ];
}

let currentQuestion = 0;
let revealedAnswers = [];
let scoreA = 0;
let scoreB = 0;
let wrongA = 0;
let wrongB = 0;

function broadcastState() {
    let q = questions[currentQuestion] || { question: "Belum ada soal, silakan tambah di admin", answers: [] };
    io.emit('state_update', {
        question: q,
        revealed: revealedAnswers,
        qIndex: currentQuestion,
        totalQ: questions.length,
        scoreA: scoreA,
        scoreB: scoreB,
        wrongA: wrongA,
        wrongB: wrongB
    });
    io.emit('admin_sync_questions', questions);
}

function saveQuestions() {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
}

io.on('connection', (socket) => {
    broadcastState();

    // Tambah Soal
    socket.on('add_question', (newQuestion) => {
        questions.push(newQuestion);
        saveQuestions();
        broadcastState();
    });

    // Edit Soal
    socket.on('edit_question', (data) => {
        questions[data.index] = data.question;
        // Jika soal yang diedit sedang tayang, reset jawaban yang terbuka
        if(currentQuestion === data.index) revealedAnswers = [];
        saveQuestions(); 
        broadcastState();
    });

    // Hapus Soal
    socket.on('delete_question', (index) => {
        questions.splice(index, 1);
        if (currentQuestion >= questions.length) {
            currentQuestion = Math.max(0, questions.length - 1);
        }
        revealedAnswers = [];
        saveQuestions();
        broadcastState();
    });

    socket.on('reveal_answer', (index) => {
        if (!revealedAnswers.includes(index) && questions.length > 0) {
            revealedAnswers.push(index);
            broadcastState();
            io.emit('play_sound', 'correct');
        }
    });

    socket.on('update_score', ({ team, delta }) => {
        if (team === 'a') scoreA += delta;
        if (team === 'b') scoreB += delta;
        broadcastState();
    });

    socket.on('reset_score', () => {
        scoreA = 0;
        scoreB = 0;
        broadcastState();
    });
    
    socket.on('reset_wrong', () => {
        wrongA = 0;
        wrongB = 0;
        broadcastState();
    });

    socket.on('show_x', (team) => {
        if (team === 'a') wrongA = Math.min(wrongA + 1, 3);
        if (team === 'b') wrongB = Math.min(wrongB + 1, 3);
        io.emit('show_x_screen');
        io.emit('play_sound', 'wrong');
        broadcastState();
    });

    socket.on('next_question', () => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            revealedAnswers = [];
            wrongA = 0;
            wrongB = 0;
            broadcastState();
        }
    });
    
    socket.on('prev_question', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            revealedAnswers = [];
            wrongA = 0;
            wrongB = 0;
            broadcastState();
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Server SENSUS 100 Berjalan!`);
    console.log(`=> Buka Layar Proyektor: http://localhost:${PORT}`);
    console.log(`=> Buka Panel Admin  : http://localhost:${PORT}/admin.html`);
    console.log(`===========================================`);
});