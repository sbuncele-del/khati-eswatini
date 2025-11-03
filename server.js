// 🚀 KHATI ESWATINI - PROFESSIONAL DEMO
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// DEMO DATA - Simulated Database
const demoUsers = [
  {
    nationalId: "S000504819J",
    name: "John Dlamini",
    phone: "+26876012345",
    services: [
      { 
        type: "driver_license", 
        number: "DL584739", 
        expiry: "2024-06-30", 
        fee: 150,
        status: "due_for_renewal"
      },
      { 
        type: "vehicle_license", 
        number: "ABC123", 
        expiry: "2024-07-15", 
        fee: 300,
        status: "due_for_renewal"
      }
    ]
  },
  {
    nationalId: "S000612345M",
    name: "Mary Simelane", 
    phone: "+26876123456",
    services: [
      {
        type: "business_license",
        number: "BL987654",
        expiry: "2024-08-20",
        fee: 500,
        status: "active"
      }
    ]
  }
];

// 🎯 HOME PAGE - Professional Landing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Khati Eswatini - Government Payment System</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
            .header { background: #0056B3; color: white; padding: 30px; border-radius: 10px; text-align: center; }
            .demo-links { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .link { display: block; padding: 15px; margin: 10px 0; background: #00A859; color: white; text-decoration: none; border-radius: 5px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Khati Eswatini</h1>
            <p>Government Payment System Prototype</p>
        </div>
        
        <div class="demo-links">
            <h2>📱 Demo Links</h2>
            <a class="link" href="/whatsapp-demo">WhatsApp Payment Simulator</a>
            <a class="link" href="/ussd-demo">USSD Menu Simulator</a>
            <a class="link" href="/api/demo">API Data Demo</a>
            <a class="link" href="/admin-demo">Admin Dashboard</a>
        </div>
        
        <div style="text-align: center; color: #666; margin-top: 40px;">
            <p>This is a working prototype for demonstration purposes</p>
        </div>
    </body>
    </html>
  `);
});

// 🎯 API ENDPOINTS
app.get('/api/demo', (req, res) => {
  res.json({
    success: true,
    system: "Khati Eswatini",
    version: "1.0.0",
    users: demoUsers.length,
    features: ["WhatsApp Payments", "USSD Menus", "Mobile Money", "Real-time Tracking"]
  });
});

app.get('/api/users/:nationalId', (req, res) => {
  const user = demoUsers.find(u => u.nationalId === req.params.nationalId);
  res.json(user ? { success: true, user } : { success: false, error: "User not found" });
});

// 🎯 WHATSAPP SIMULATION
app.post('/api/whatsapp', (req, res) => {
  const { message, session } = req.body;
  
  console.log("WhatsApp Message:", message);
  
  if (!session || session.step === 'start') {
    if (message.toLowerCase().includes('license') || message.toLowerCase().includes('renew')) {
      res.json({
        reply: "🇸🇿 Welcome to Khati Eswatini! Please enter your ID Number to renew your license:",
        session: { step: 'awaiting_id', service: 'license_renewal' }
      });
    } else {
      res.json({
        reply: "Hello! I can help you with government services. Type 'renew license' to start.",
        session: { step: 'start' }
      });
    }
  } else if (session.step === 'awaiting_id') {
    const user = demoUsers.find(u => u.nationalId === message);
    if (user) {
      const license = user.services.find(s => s.type === 'driver_license');
      res.json({
        reply: `✅ ${user.name}, Driver's License ${license.number} renewal fee: E${license.fee}\\n\\nPay with:\\n1. MTN Mobile Money\\n2. Eswatini Mobile`,
        session: { step: 'awaiting_payment', user: user.nationalId, service: 'license_renewal' }
      });
    } else {
      res.json({
        reply: "❌ ID not found. Please enter a valid ID Number:",
        session: { step: 'awaiting_id' }
      });
    }
  } else if (session.step === 'awaiting_payment') {
    res.json({
      reply: "✅ Payment successful! Your license renewal is processing. New license will be ready in 3 working days. Reference: KTH78492",
      session: { step: 'completed' }
    });
  }
});

// 🎯 USSD SIMULATION
app.post('/api/ussd', (req, res) => {
  const { input, sessionId } = req.body;
  
  if (!input) {
    res.json({
      message: "Welcome to Khati Eswatini:\\n1. Transport Services\\n2. Business Licenses\\n3. Utility Bills\\n4. Check Status",
      type: "CON"
    });
  } else if (input === '1') {
    res.json({
      message: "Transport Services:\\n1. Driver's License\\n2. Vehicle License\\n3. Road Tax",
      type: "CON"
    });
  } else if (input === '1*1') {
    res.json({
      message: "Enter ID Number:",
      type: "CON"
    });
  } else if (input.startsWith('1*1*')) {
    const id = input.split('*')[2];
    const user = demoUsers.find(u => u.nationalId === id);
    if (user) {
      res.json({
        message: `${user.name}, License fee: E150\\n1. Confirm Payment\\n2. Cancel`,
        type: "CON"
      });
    } else {
      res.json({
        message: "ID not found. Try again:",
        type: "CON"
      });
    }
  } else {
    res.json({
      message: "Thank you for using Khati Eswatini!",
      type: "END"
    });
  }
});

// 🎯 DEMO PAGES
app.get('/whatsapp-demo', (req, res) => {
  res.sendFile(__dirname + '/public/whatsapp-demo.html');
});

app.get('/ussd-demo', (req, res) => {
  res.sendFile(__dirname + '/public/ussd-demo.html');
});

app.get('/admin-demo', (req, res) => {
  res.sendFile(__dirname + '/public/admin-demo.html');
});

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`
🌈 KHATI ESWATINI DEMO SERVER 🌈
📍 Local: http://localhost:${PORT}
🚀 Ready for deployment!
  `);
});