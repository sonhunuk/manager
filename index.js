require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const moment = require('moment')
const ms = require('ms')
const { measureMemory } = require('vm')
const token = process.env.token

const PREFIX = "!"

client.on('ready', () => console.log("작동중!"))

client.on('message', async message => {
    const args = message.content.substring(PREFIX.length).split(" ")
    const mentionedMember = message.mentions.members.first()
    const mentionedRole = message.mentions.roles.first()

    if (message.content.startsWith(`${PREFIX}추방`)) {
        const reason = args.slice(2).join(" ")
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(`<@${message.author.id}>님, 추방 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.channel.send(`<@${message.author.id}>님, 추방할 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 추방할 대상을 선택해주세요!`)
        if (!mentionedMember) return message.channel.send(`<@${message.author.id}>님, 대상을 찾을 수 없습니다.`)

        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position || message.author.id !== message.guild.owner.id) {
            return message.channel.send(`<@${message.author.id}>님, 대상자의 역할이 더 높기 때문에 이 멤버를 추방 할 수 없습니다.`)
        }
        if (mentionedMember.id === message.author.id) return message.channel.send("자기 자신을 추방할 수 없습니다!!!")
        if (mentionedMember.kickable) {
            var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#ffac68')
            .setDescription(`
**해당 멤버 :** <@${mentionedMember.user.id}>
**명령어 :** 추방
**이유 :** ${reason || "없음"}

**시간 :** ${moment().format(`llll`)}
            `)
            message.channel.send(embed)
            mentionedMember.kick()
        } else {
            return message.channel.send("이 대상을 추방 할 수 없습니다. 권한이 있는지 확인하세요.")
        }
        return undefined
    } else if (message.content.startsWith(`${PREFIX}차단`)) {
        const reason = args.slice(2).join(" ")
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(`<@${message.author.id}>님, 차단 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`<@${message.author.id}>님, 차단할 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 차단할 대상을 선택해주세요!`)
        if (!mentionedMember) return message.channel.send(`<@${message.author.id}>님, 대상을 찾을 수 없습니다.`)
        if (mentionedMember.roles.highest.position >= message.channel.roles.highest.position || message.author.id !== message.guild.owner.id) {
            return message.channel.send(`<@${message.author.id}>님, 대상자의 역할이 더 높기 때문에 이 멤버를 추방 할 수 없습니다.`)
        }
        if (mentionedMember.id === message.author.id) return message.channel.send("자기 자신을 추방할 수 없습니다!!!")
        if (mentionedMember.bannable) {
            var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#ff0000')
            .setDescription(`
**해당 멤버 :** <@${mentionedMember.user.id}>
**명령어 :** 차단
**이유 :** ${reason || "없음"}

**시간 :** ${moment().format('llll')}
            `)
            message.channel.send(embed)
            mentionedMember.ban()
        } else {
            return message.channel.send("이 대상을 차단 할 수 없습니다. 권한이 있는지 확인하세요.")
        }
        return undefined
    } else if (message.content.startsWith(`${PREFIX}밴해제`)) {
        const reason = args.slice(2).join(" ")
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(`<@${message.author.id}>님, 밴해제 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`<@${message.author.id}>님, 밴해제할 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 밴해제할 대상을 선택해주세요!`)
        if (!mentionedMember) return message.channel.send(`<@${message.author.id}>님, 대상을 찾을 수 없습니다.`)
        if (mentionedMember.roles.highest.position >= message.channel.roles.highest.position || message.author.id !== message.guild.owner.id) {
            return message.channel.send(`<@${message.author.id}>님, 대상자의 역할이 더 높기 때문에 이 멤버를 밴해제를 할 수 없습니다.`)
        }
        if (mentionedMember.id === message.author.id) return message.channel.send("자기 자신을 밴해제할 수 없습니다!!!")
        if (mentionedMember.bannable) {
            var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#84ff68')
            .setDescription(`
**해당 멤버 :** <@${mentionedMember.user.id}>
**명령어 :** (밴)해제
**이유 :** ${reason || "없음"}

**시간 :** ${moment().format('llll')}
            `)
            message.channel.send(embed)
            mentionedMember.ban({days: 1}).then(() => message.guild.members.unban(mentionedMember.id))
        } else {
            return message.channel.send("이 대상을 밴해제 할 수 없습니다. 권한이 있는지 확인하세요.")
        }
        return undefined
    } else if (message.content.startsWith(`${PREFIX}뮤트`)) {
        const reason = args.slice(3).join(" ")
        const regex = /\d+[smhdw]/.exec(args[2])
        if (!message.member.hasPermission(`KICK_MEMBERS`)) return message.channel.send(`<@${message.author.id}>님, 뮤트 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(`<@${message.author.id}>님, 역할 부여 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 뮤트할 대상을 선택해주세요!`)
        if (!mentionedMember) return message.channel.send(`<@${message.author.id}>님, 대상을 찾을 수 없습니다.`)
        if (!args[2]) return message.channel.send(`<@${message.author.id}>님, 이 유저를 뮤트 할 기간을 지정해야합니다. 초단위(s)`)
        if (!regex) return message.channel.send(`<@${message.author.id}>님, 유효한 값이 아닙니다.`)
        if (ms(regex[0]) > 214748367) return message.channel.send(`<@${message.author.id}>님, 최대 25일까지 기간을 정할 수 있습니다!`)
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) {
            return message.channel.send(`<@${message.author.id}>님, 대상자의 역할이 더 높기 때문에 이 멤버를 뮤트(을)를 할 수 없습니다.`)
        }
        if (mentionedMember.id === message.author.id) return message.channel.send(`자기 자신을 뮤트 할 수 없습니다!!!`)
        var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#84ff68')
            .setDescription(`
**해당 멤버 :** <@${mentionedMember.user.id}>
**명령어 :** 뮤트
**이유 :** ${reason || "없음"}
**뮤트기간 :** ${regex[0]}(초)

**시간 :** ${moment().format('llll')}
            `)
            message.channel.send(embed)
            if (mentionedMember.roles.cache.has('704809748670709765')) return message.channel.send(`<@${message.author.id}>님, 이 대상자는 이미 뮤트 상태입니다.`)
            mentionedMember.roles.add('704809748670709765')
            mentionedMember.roles.remove('704669697504837744')
            setTimeout(() => {
                if (!mentionedMember.roles.cache.has('704809748670709765')) return undefined
                mentionedMember.roles.remove('704809748670709765')
                mentionedMember.roles.add('704669697504837744')
                message.channel.send(`${mentionedMember}님이 ${regex[0]}(초) 이후 음소거 해제되었습니다!`)
            }, ms(regex[0]))
            return undefined
    } else if (message.content.startsWith(`${PREFIX}언뮤트`)) {
        const reason = args.slice(2).join(" ")
        if (!message.member.hasPermission(`KICK_MEMBERS`)) return message.channel.send(`<@${message.author.id}>님, 언뮤트 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(`<@${message.author.id}>님, 역할 부여 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 언뮤트할 대상을 선택해주세요!`)
        if (!mentionedMember) return message.channel.send(`<@${message.author.id}>님, 대상을 찾을 수 없습니다.`)
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) {
            return message.channel.send(`<@${message.author.id}>님, 대상자의 역할이 더 높기 때문에 이 멤버를 언뮤트(을)를 할 수 없습니다.`)
        }
        if (mentionedMember.id === message.author.id) return message.channel.send(`자기 자신을 언뮤트 할 수 없습니다!!!`)
        var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#84ff68')
            .setDescription(`
**해당 멤버 :** <@${mentionedMember.user.id}>
**명령어 :** 언뮤트
**이유 :** ${reason || "없음"}

**시간 :** ${moment().format('llll')}
            `)
            message.channel.send(embed)
            mentionedMember.roles.remove('704809748670709765')
            return undefined
    } else if (message.content.startsWith(`${PREFIX}추가`)) {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(`<@${message.author.id}>님, 추가 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(`<@${message.author.id}>님, 추가할 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 추가할 대상을 선택해주세요!`)
        if (!mentionedMember) return message.channel.send(`<@${message.author.id}>님, 대상을 찾을 수 없습니다.`)
        if (!args[2]) return message.channel.send(`<@${message.author.id}>님, 이 유저에 올바른 역할을 지정해주세요.`)
        if (!mentionedRole) return message.channel.send(`<@${message.author.id}>님, 그 해당 역할을 찾지 못했습니다.`)
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) {
            return measureMemory.channel.send(`<@${message.author.id}>님, 대상자의 역할이 더 높기 때문에 이 멤버를 역할 추가(을)를 할 수 없습니다.`)
        }
        if (mentionedMember.roles.cache.has(mentionedRole.id)) return message.channel.send(`<@${message.author.id}>님, 그 멤버는 이미 해당 역할을 가지고 있습니다.`)
        var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#84ff68')
            .setDescription(`
**해당 멤버 :** <@${mentionedMember.user.id}>
**명령어 :** (역할) 추가
**추가한 역할 :** ${mentionedRole}

**시간 :** ${moment().format('llll')}
            `)
            message.channel.send(embed)
            mentionedMember.roles.add(mentionedRole.id)
            return undefined
    } else if (message.content.startsWith(`${PREFIX}제거`)) {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(`<@${message.author.id}>님, 제거 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(`<@${message.author.id}>님, 제거할 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 제거할 대상을 선택해주세요!`)
        if (!mentionedMember) return message.channel.send(`<@${message.author.id}>님, 대상을 찾을 수 없습니다.`)
        if (!args[2]) return message.channel.send(`<@${message.author.id}>님, 이 유저에 올바른 역할을 지정해주세요.`)
        if (!mentionedRole) return message.channel.send(`<@${message.author.id}>님, 그 해당 역할을 찾지 못했습니다.`)
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) {
            return measureMemory.channel.send(`<@${message.author.id}>님, 대상자의 역할이 더 높기 때문에 이 멤버를 역할 제거(을)를 할 수 없습니다.`)
        }
        if (!mentionedMember.roles.cache.has(mentionedRole.id)) return message.channel.send(`<@${message.author.id}>님, 그 멤버는 그 역할을 가지고 있지 않습니다.`)
        var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(mentionedMember.user.displayAvatarURL())
            .setColor('#84ff68')
            .setDescription(`
**해당 멤버 :** <@${mentionedMember.user.id}>
**명령어 :** (역할) 제거
**제거한 역할 :** ${mentionedRole}

**시간 :** ${moment().format('llll')}
            `)
            message.channel.send(embed)
            mentionedMember.roles.remove(mentionedRole.id)
            return undefined
    } else if (message.content.startsWith(`${PREFIX}청소`)) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`<@${message.author.id}>님, 청소 명령어를 사용할 권한이 없습니다.`)
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`<@${message.author.id}>님, 청소할 권한이 없습니다.`)
        if (!args[1]) return message.channel.send(`<@${message.author.id}>님, 청소할 양의 값을 적어주세요.`)
        if (isNaN(args[1])) return message.channel.send(`<@${message.author.id}>님, 메세지 청소 양의 값이 올바르지 않습니다.`)
        if (args[1] > 100 || args[1] < 2) return message.channel.send(`<@${message.author.id}>님, 2 - 100 까지의 삭제할 양의 값을 적어주세요.`)
        try {
            await message.channel.bulkDelete(args[1])
        } catch {
            return message.channel.send(`<@${message.author.id}>님, 14 일 이내의 메시지만 삭제할 수 있습니다.`)
        }
        var embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
        .setThumbnail(message.author.displayAvatarURL())
        .setColor('#84ff68')
        .setDescription(`
**명령어 :** 청소
**메세지 삭제한 양 :** ${args[1]}

**시간 :** ${moment().format('llll')}
        `)
        message.channel.send(embed)
    }
})

client.login(token)