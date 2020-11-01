<div>
<nav className={styles.nav}>
  <ul className={styles.navLinks}>
      <li><a href=''><FavoriteBorderIcon/></a></li>
      <li><a href=''><ContactMailIcon/></a></li>
      <li><a href={data!=null?`/profile/${data.profilePage.user.name}`:``}>
        <img src={data!=null?`http://localhost:4000/profilePictures/${data.profilePage.user.profilePicture}`:<PersonIcon/>}/>
      </a></li>
  </ul>
</nav>
</div>