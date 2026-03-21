const supabaseUrl = 'https://nkskdibhsqyxgirotoly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rc2tkaWJoc3F5eGdpcm90b2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTYxNDQsImV4cCI6MjA4OTMzMjE0NH0.yq3jFykJN4EVgIJ1gTpf1ue2tq1zNz6keVCBcLxSAwc';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const ADMINS = ['jcesperanza@neu.edu.ph', 'eduardo.donato@neu.edu.ph'];

// 1. Google Login (cite: 12)
async function login() {
    const { error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href }
    });
    if (error) alert("Login error: " + error.message);
}

// 2. Session Check (Automatic redirect)
async function checkSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        document.getElementById('user-status').innerText = `Logged in as: ${session.user.email}`;

        if (ADMINS.includes(session.user.email.toLowerCase())) {
            showView('admin');
        } else {
            showView('kiosk');
        }
    }
}

// 3. Navigation
function showView(view) {
    document.getElementById('admin-view').style.display = (view === 'admin') ? 'block' : 'none';
    document.getElementById('kiosk-view').style.display = (view === 'kiosk') ? 'block' : 'none';
    if(view === 'admin') loadAdminLogs();
}

// 4. Load Data (Live Activity)
async function loadAdminLogs() {
    const { data, error } = await _supabase
        .from('attendance')
        .select('*')
        .order('created_at', { ascending: false });

    if (data) {
        document.getElementById('admin-log-data').innerHTML = data.map(log => `
            <tr>
                <td><strong>${log.full_name}</strong></td>
                <td>${log.college}</td>
                <td>${log.reason}</td>
                <td>${new Date(log.created_at).toLocaleTimeString()}</td>
            </tr>
        `).join('');
    }
}

// 5. Submit Form (Kiosk)
async function submitLog() {
    const { data: { session } } = await _supabase.auth.getSession();
    const entry = {
        full_name: session.user.user_metadata.full_name,
        email: session.user.email,
        user_type: document.getElementById('user-type').value,
        college: document.getElementById('college').value,
        reason: document.getElementById('reason').value
    };

    const { error } = await _supabase.from('attendance').insert([entry]);
    if (!error) {
        alert("Success! Enjoy the Library.");
        loadAdminLogs();
        checkSession();
    }
}

// 6. Clock & Logout
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

async function logout() { 
    await _supabase.auth.signOut(); 
    window.location.reload(); 
}

// Start
checkSession();
