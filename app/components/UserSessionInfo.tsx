import AuthButton from "./authButton/page";

const UserSessionInfo = ({ session }: { session: any }) => (
    <span className="fixed top-0 right-0 text-white">
        <AuthButton />
    </span>
);

export default UserSessionInfo;
