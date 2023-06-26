import InputGroup from "../../components/InputGroup"

const SubCreate = () => {
    return (
        <div className="flex flex-col justify-center pt-16">
            <div className="w-10/12 mx-auto md:w-96">
                <h1 className="mb-2 text-lg font-medium">
                        커뮤니티 만들기
                </h1>
                <hr />
                <form>
                    <div className="my-6">
                        <p className="font-medium">Name</p>
                        <p className="mb-2 text-xs text-gray-400">
                            커뮤니티 이름은 변경할 수 없습니다.
                        </p>
                        <InputGroup
                            placeholder="이름"
                            value
                            setValue
                            error
                        />
                    </div>
                    <div className="my-6">
                        <p className="font-medium">Title</p>
                        <p className="mb-2 text-xs text-gray-400">
                            주제를 나타냅니다. 언제든지 변경할 수 있습니다.
                        </p>
                        <InputGroup
                            placeholder="제목"
                            value
                            setValue
                            error
                        />
                    </div>
                    <div className="my-6">
                        <p className="font-medium">Discription</p>
                        <p className="mb-2 text-xs text-gray-400">
                            해당 커뮤니티에 대한 설명입니다.
                        </p>
                        <InputGroup
                            placeholder="설명"
                            value
                            setValue
                            error
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="px-4 py-1 text-sm font-semibold rounded text-white bg-gray-400 border"
                        >
                            커뮤니티 만들기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}