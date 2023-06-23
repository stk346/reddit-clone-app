import React from "react";
import cls from "classnames";

/**
 * props를 미리 정의해주는 인터페이스
 */
interface InputGroupProps {
    className?: string; // className이 들어올 수도 있고 안들어올 수도 있다는 뜻
    type?: string;
    placeholder?: string;
    value: string;
    error: string | undefined;
    setValue: (str: string) => void; // string을 받는데 return값은 void
}

/**
 * InputGroupProps가 React Functional Componene의 타입임을 명시
 */
const InputGroup: React.FC<InputGroupProps> = ({
    className = "mb-2", // 아무것도 안들어온 경우 기본값 설정
    type = "text",
    placeholder = "",
    error,
    value,
    setValue
}) => {
    return (
        <div className={className}>
            <input 
                type={type}
                style={{ minWidth: 300 }}
                // cls 는 classname 모듈 -> 2번째 파라미터 값이 참인지, 거짓인지에 따라 액션을 취해줌
                // error가 참이면 빨간색, 없으면 옵션 적용 안함
                className={
                    cls(`w-full p-3 transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
                        {"border-red-500": error}
                    )}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

        <small className="font-medium text-red-500">{error}</small>
        </div>
    )
}

export default InputGroup;