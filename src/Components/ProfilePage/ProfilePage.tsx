import styles from "./ProfilePage.module.css"
import ProfileSettings from "../ProfileSettings/ProfileSettings.tsx"

function ProfilePage() {

    return(
        <div className={styles.content}>
            <h2>Особистий кабінет</h2>
            <ProfileSettings />
        </div>
    )
}

export default ProfilePage;