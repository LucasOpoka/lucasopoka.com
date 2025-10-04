import { Avatar } from "@mui/material";

function Photo() {
  return (
    <Avatar
      sx={{ 
        width: 128, 
        height: 128,
      }}
      src="https://avatars.githubusercontent.com/u/83923012?v=4"
      alt="It's a me, Lucas!"
    />
  )
}

export default Photo;