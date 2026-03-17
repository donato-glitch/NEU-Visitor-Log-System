const supabaseUrl = 'https://nkskdibshqyxgirotoly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rc2tkaWJoc3F5eGdpcm90b2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTYxNDQsImV4cCI6MjA4OTMzMjE0NH0.yq3jFykJN4EVgIJ1gTpf1ue2tq1zNz6keVCBcLxSAwc'; 

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'jcesperanza@neu.edu.ph';

// Login Function
document.getElementById('login-btn').addEventListener('click', async () => {
    await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href }
    });
});

// Check Session
async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        const userEmail = session.user.email;
        document.getElementById('auth-section').style.display = 'none';
        
        if (userEmail === ADMIN_EMAIL) {
            document.getElementById('admin-section').style.display = 'block';
            document.getElementById('greeting').innerText = "Welcome, Admin Jeremias!";
            // Dito lalabas ang stats cards
        } else {
            document.getElementById('user-section').style.display = 'block';
            document.getElementById('greeting').innerText = "Welcome to NEU Library!";
        }
    }
}
checkUser();
