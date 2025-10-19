// Export the config object
export const configObj = {
  // The root filesystem location
  diskImageUrl: "/disk-images/debian_mini_20230519_5022088024.ext2",
  // The root filesystem backend type
  diskImageType: "bytes",
  // Executable full path (Required)
  cmd: "/bin/bash",
  // Arguments, as an array (Required)
  args: ["--login"],
  // Optional extra parameters
  opts: {
  	// Environment variables
  	env: ["HOME=/home/user", "TERM=xterm", "USER=user", "SHELL=/bin/bash", "EDITOR=vim", "LANG=en_US.UTF-8", "LC_ALL=C"],
  	// Current working directory
  	cwd: "/home/user",
  	// User id
  	uid: 1000,
  	// Group id
  	gid: 1000
  }
};
