const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.password
    }
});

exports.sendLowGasNotification = functions.firestore
    .document('users/{userId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const previousData = change.before.data();
        
        if (!newData.settings?.emailNotifications) return;
        
        const threshold = newData.settings.notificationThreshold || 3;
        const userEmail = newData.email;
        
        const lowGasCylinders = newData.gasCylinders.filter(
            cylinder => cylinder.currentWeight <= threshold
        );
        
        if (lowGasCylinders.length > 0) {
            const mailOptions = {
                from: 'Gas Usage Monitor <noreply@gasusage.com>',
                to: userEmail,
                subject: 'Low Gas Level Alert',
                html: `
                    <h2>Low Gas Level Alert</h2>
                    <p>The following gas cylinders are running low:</p>
                    <ul>
                        ${lowGasCylinders.map(cylinder => `
                            <li>${cylinder.size}KG cylinder - Current weight: ${cylinder.currentWeight}KG</li>
                        `).join('')}
                    </ul>
                `
            };
            
            await transporter.sendMail(mailOptions);
        }
    }); 