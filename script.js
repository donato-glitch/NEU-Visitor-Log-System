const supabaseUrl = 'https://nkskdibhsqyxgirotoly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rc2tkaWJoc3F5eGdpcm90b2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTYxNDQsImV4cCI6MjA4OTMzMjE0NH0.yq3jFykJN4EVgIJ1gTpf1ue2tq1zNz6keVCBcLxSAwc';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
const ADMIN_EMAILS = ['jcesperanza@neu.edu.ph', 'eduardo.donato@neu.edu.ph'];

document.getElementById('login-btn').addEventListener('click', async () => {
    await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'https://donato-glitch.github.io/NEU-Visitor-Log-System/' }
    });
});

async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('user-section').style.display = 'block';
        
        const user = session.user;
        if (ADMIN_EMAILS.includes(user.email)) {
            document.getElementById('admin-view').style.display = 'block';
            fetchStats();
        }
    }
}

async function submitLog() {
    const { data: { session } } = await _supabase.auth.getSession();
    const reason = document.getElementById('reason').value;
    if (!reason) return alert("Please enter a reason for your visit.");

    const { error } = await _supabase.from('attendance').insert([{
        full_name: session.user.user_metadata.full_name,
        email: session.user.email,
        user_type: document.getElementById('user-type').value,
        college: document.getElementById('college').value,
        reason: reason
    }]);

    if (!error) {
        alert("Success! Log recorded.");
        document.getElementById('visitor-form-container').innerHTML = "<h4>✅ Visit Logged Successfully. Enjoy the Library!</h4>";
        fetchStats();
    }
}

async function fetchStats() {
    const { data, error } = await _supabase.from('attendance').select('*').order('logged_at', { ascending: false });
    if (!error) {
        document.getElementById('today-count').innerText = data.length;
        document.getElementById('emp-count').innerText = data.filter(r => r.user_type !== 'Student').length;
        document.getElementById('ics-count').innerText = data.filter(r => r.college === 'ICS').length;

        document.getElementById('logs-body').innerHTML = data.map(log => `
            <tr>
                <td>${log.full_name}</td>
                <td>${log.college}</td>
                <td>${log.reason}</td>
                <td>${new Date(log.logged_at).toLocaleTimeString()}</td>
            </tr>
        `).join('');
    }
}

async function logout() {
    await _supabase.auth.signOut();
    window.location.reload();
}
checkUser();
