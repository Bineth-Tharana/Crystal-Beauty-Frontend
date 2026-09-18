import UserData from "./userData";

export default function Header(){
    return(
        <div className="bg-[#FFFF00]">
            <h1 className="text-[300px] font-bold text-blue-700">Crystal Beauty Clear</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, sint nostrum magni repellendus dicta minima harum autem, praesentium blanditiis ullam animi rerum ipsa voluptates, explicabo cum et at aliquam! Dignissimos.</p>
            <UserData></UserData>
        </div>
    )
}