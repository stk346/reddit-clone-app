import Link from "next/link";
import React, { FormEvent, useState } from "react";
import axios from "axios";
import InputGroup from "../components/InputGroup";
import { useRouter } from "next/router";
import { useAuthState } from "../context/auth";

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<any>({});
    const {authenticated} = useAuthState();

    let router = useRouter();
    if (authenticated) router.push("/");


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault(); // 이벤트가 일어났을 때 페이지가 새로고침 되는 것을 방지

        try {
            const res = await axios.post('/auth/register', {
                email: email, // 자바스크립트는 이와 같이 타입이 같으면 타입을 생략할 수 있음. 아래의 password와 이 줄은 같은 기능을 수행
                password,
                username
            });
    
            console.log("res", res);
            router.push("/login");
        } catch(error: any) {
            console.log('error', error);
            setErrors(error.response?.data || {});
        }
    }
    return (
        <div className="bg-white">
            <div className="flex flex-col items-center justify-content h-screen p-6">
                <div className='w-10/12 mx-auto md:w-96'>
                    <h1 className="mb-2 text-lg font-medium">회원가입</h1>
                    <form onSubmit={handleSubmit}>
                        <InputGroup
                            placeholder="Email"
                            value={email}
                            setValue={setEmail}
                            error={errors.email}
                        />
                        <InputGroup
                            placeholder="Username"
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                        />
                        <InputGroup
                            placeholder="Password"
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                        />
                        <button className="w-full py-2 mb-1 text-xs fond-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
                            회원가입
                        </button>
                    </form>
                    <small>
                        이미 가입하셨나요?
                        <Link href="/login" className="ml-1 text-blue-500 uppercase">로그인</Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default Register;