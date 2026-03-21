const supabaseUrl = 'https://nkskdibhsqyxgirotoly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rc2tkaWJoc3F5eGdpcm90b2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTYxNDQsImV4cCI6MjA4OTMzMjE0NH0.yq3jFykJN4EVgIJ1gTpf1ue2tq1zNz6keVCBcLxSAwc';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);


const ADMINS = [
    'jcesperanza@neu.edu.ph', 
    'eduardo.donato@neu.edu.ph', 
    
];

async function login() {
    await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
    });
}

async function checkSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        document.getElementById('user-status').innerText = `Logged in as: ${session.user.email}`;

        // Redirect based on role
        if (ADMINS.includes(session.user.email.toLowerCase())) {
            showView('admin');
        } else {
            showView('kiosk');
        }
    }
}

function showView(view) {
    document.getElementById('admin-view').style.display = (view === 'admin') ? 'block' : 'none';
    document.getElementById('kiosk-view').style.display = (view === 'kiosk') ? 'block' : 'none';
    if(view === 'admin') loadAdminLogs();
}

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

async function submitLog() {
    const { data: { session } } = await _supabase.auth.getSession();
    const { error } = await _supabase.from('attendance').insert([{
        full_name: session.user.user_metadata.full_name,
        email: session.user.email,
        college: document.getElementById('college').value,
        reason: document.getElementById('reason').value
    }]);

    if (!error) {
        alert("Success! Your visit has been logged.");
        window.location.reload();
    }
}

async function logout() {
    await _supabase.auth.signOut();
    window.location.href = window.location.origin + window.location.pathname;
}

setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

checkSession();
