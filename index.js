const nodemailer = require("nodemailer")
const Imap = require('node-imap');

const imap = new Imap({
    user: 'acanthuridae@foxmail.com',
    password: 'chvgeqzhyogwdgdf',
    host: 'imap.qq.com', // IMAP server hostname
    port: 993, // IMAP server port for SSL
    tls: true, // Use TLS/SSL
});

imap.connect();

imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
        if (err) throw err;

        // Fetch emails (e.g., the most recent 10)
        const fetch = imap.seq.fetch(box.messages.total - 9 + ':' + box.messages.total, {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        });

        fetch.on('message', (msg, seqno) => {
            msg.on('body', (stream, info) => {
                let buffer = '';

                stream.on('data', (chunk) => {
                    buffer += chunk.toString('utf8');
                });

                stream.once('end', () => {
                    console.log('Email #%d:', seqno);
                    console.log(buffer);
                });
            });

            msg.once('end', () => {
                // Process the email
            });
        });

        fetch.once('error', (err) => {
            console.error('Error fetching emails:', err);
        });

        fetch.once('end', () => {
            console.log('Done fetching emails.');
            imap.end();
        });
    });
});

imap.once('error', (err) => {
    console.error('Error connecting to IMAP server:', err);
});
