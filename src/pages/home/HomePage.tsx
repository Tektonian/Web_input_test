import { useSession } from "../../hooks/Session";

import Footer from "./components/Footer";
import Hero from "./components/Hero";

const HomePage = () => {
    const session = useSession();

    const roles = session.data?.user?.roles;

    let HeroDisplay: ReturnType<typeof Hero>;
    console.log(roles);

    if (roles === null || roles === undefined) {
        // No login
        // or Not verified
        HeroDisplay = Hero({ userRole: undefined });
    } else if (roles.includes("normal")) {
        // Logged in and verified
        HeroDisplay = Hero({ userRole: "normal" });
    } else if (roles.includes("student")) {
        // Student user
        HeroDisplay = Hero({ userRole: "student" });
    } else if (roles.includes("corp") || roles.includes("orgn")) {
        // Organzation user
        HeroDisplay = Hero({ userRole: "corp" });
    } else {
        HeroDisplay = Hero({ userRole: undefined });
    }

    return (
        <>
            {HeroDisplay}
            <div>
                <Footer />
            </div>
        </>
    );
};

export default HomePage;
