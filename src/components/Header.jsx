export default function Header() {
    function logout() {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
    return (
        <header>
            <nav className="bg-[#333] text-white p-4 flex gap-x-4">
                <a href="/dashboard">Home</a>
                <a href="/projects">Projects</a>
                <a href="/users">Users</a>
                <a href="#" onClick={logout}>Logout</a>
            </nav>
        </header>
    );
}