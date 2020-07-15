var grunt = require('grunt');

grunt.config.init({
    pkg: grunt.file.readJSON('./DiscordRPC/package.json'),
    'create-windows-installer': {
        ia32: {
            appDirectory: './DiscordRPC/DiscordRPC-win32-x64',
            outputDirectory: './DiscordRPC/DiscordRPCInstaller',
            authors: 'Rirto',
            title: 'DiscordRPC',
            exe: 'DiscordRPC.exe',
            description: 'DiscordRPC',
            noMsi: true,
            loadingGif: 'DC.ico',
            setupIcon: 'DC.ico',
            icon: 'DC.ico',
        }
    }
})

grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask('default', ['create-windows-installer']);