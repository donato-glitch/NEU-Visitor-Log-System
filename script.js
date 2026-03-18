const supabaseUrl = 'https://nkskdibhsqyxgirotoly.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rc2tkaWJoc3F5eGdpcm90b2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTYxNDQsImV4cCI6MjA4OTMzMjE0NH0.yq3jFykJN4EVgIJ1gTpf1ue2tq1zNz6keVCBcLxSAwc';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Login Function
document.getElementById('login-btn').addEventListener('click', async () => {
    await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://donato-glitch.github.io/NEU-Visitor-Log-System/'
        }
    });
});

// Check Session & Record Log
async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (session) {
        const user = session.user;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('user-section').style.display = 'block';
        
        const fullName = user.user_metadata.full_name || user.email;
        document.getElementById('greeting').innerText = "Welcome, " + fullName;

        // I-save ang log sa database (kung wala pa ngayong araw)
        const loggedInToday = localStorage.getItem('last_log_date');
        const today = new Date().toLocaleDateString();

        if (loggedInToday !== today) {
            const { error } = await _supabase
                .from('attendance')
                .insert([{ full_name: fullName, email: user.email }]);
            
            if (!error) {
                localStorage.setItem('last_log_date', today);
                alert("Log recorded successfully!");
            } else {
                console.error("Error logging:", error.message);
            }
        }
    }
}

async function logout() {
    await _supabase.auth.signOut();
    localStorage.removeItem('last_log_date');
    window.location.reload();
}

checkUser();
