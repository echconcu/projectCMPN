import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            window.location.href = "/login";
        }
    }, []);

    function logout() {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return (
        <div className="flex flex-col h-full">
            <header className="bg-[#213555] py-5 text-center flex-col flex justify-center items-center">
                <h1 className="text-[#F5EFE7] text-5xl font-bold">Welcome, {user?.username}</h1>
                <h2 className="text-[#F5EFE7] text-3xl">Dự án: Ứng dụng quản lý công việc cho cá nhân, doanh nghiệp nhỏ. </h2>
            </header>
            <div className="text-center flex flex-col items-center justify-center flex-1">
                <h3 className="text-[#213555] text-5xl font-bold">Tỷ lệ đóng góp</h3>
                <h4
                    className="bg-[#3E5879] text-[#F5EFE7] text-3xl font-bold py-2 px-4 rounded w-[400px] mx-auto mt-4"
                >
                    Huỳnh Bảo Hân - 55%
                </h4>
                <h5
                    className="bg-[#3E5879] text-[#F5EFE7] text-3xl font-bold py-2 px-4 rounded w-[350px] mx-auto mt-4"
                >
                    Đoàn Đình Cao - 45%
                </h5>
            </div>
            <footer className="bg-[#213555] text-[#F5EFE7] p-4 w-full">
                <h2 className="text-left px-4">
                    Huỳnh Bảo Hân - 106210046 - 21KTMT
                </h2>
                <br></br>
                <h2 className="text-left px-4">
                    Đoàn Đình Cao - 106210229 - 21KTMT2
                </h2>
                <p className="m-0 text-base text-center">
                    &copy; {new Date().getFullYear()} Da Nang University of Science and Technology.
                </p>
            </footer>
        </div>
    );
}

