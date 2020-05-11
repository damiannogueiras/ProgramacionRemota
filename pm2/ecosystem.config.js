module.exports = {
    apps: [
        {
            script: 'node-red',
            args: '-s /home/pi/ProgramacionRemota/node-red/AA00/settings.js',
            cwd: '/home/pi/ProgramacionRemota/node-red/AA00',
            watch: 'false',
            name: 'AA00'
        },
        {
            script: 'node-red',
            args: '-s /home/pi/ProgramacionRemota/node-red/AA01/settings.js',
            cwd: '/home/pi/ProgramacionRemota/node-red/AA01',
            watch: 'false',
            name: 'AA01'
        },
        {
            script: 'node-red',
            args: '-s /home/pi/ProgramacionRemota/node-red/AA02/settings.js',
            cwd: '/home/pi/ProgramacionRemota/node-red/AA02',
            watch: 'false',
            name: 'AA02'
        },
        {
            script: 'node-red',
            args: '-s /home/pi/ProgramacionRemota/node-red/AA03/settings.js',
            cwd: '/home/pi/ProgramacionRemota/node-red/AA03',
            watch: 'false',
            name: 'AA03'
        },
    ]
};
