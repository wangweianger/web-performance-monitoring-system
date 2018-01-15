import {
    util,
    mysql
} from '../tool'
import nodemailer from 'nodemailer'
import {
    NODEMAILER
} from '../config'


class Nodermailer {

    //初始化对象
    constructor() {

    };


    // send Email           
    async sendEmail(ctx, next) {
        try {
            let user = ctx.request.body.user
            let sysName = ctx.request.body.sysName
            let sysCode = ctx.request.body.sysCode
            let receiveEmail = ctx.request.body.receiveEmail
            let time = ctx.request.body.time
            let successStr = ctx.request.body.successStr
            let fileDir = ctx.request.body.fileDir
            let onlineAcServerDir = ctx.request.body.onlineAcServerDir

            if (!receiveEmail) {
                ctx.body = util.result({
                    desc: "没有邮件接收人!"
                });
                return false;
            };

            let transporter = nodemailer.createTransport({
                service: NODEMAILER.HOST,
                auth: {
                    user: NODEMAILER.USER,
                    pass: NODEMAILER.PASSWORD
                }
            });
            let str = ''
            let tystr = ''

            if (fileDir) {
                str = `${user}：发布了${sysName}活动-全路径为：${onlineAcServerDir}${fileDir}`
                tystr = '活动'
            } else {
                str = `${user}：发布了${sysName} - ${sysCode}`
                tystr = '系统'
            }

            let mailOptions = {
                from: `"启明星前端"<${NODEMAILER.USER}>`,
                to: receiveEmail,
                subject: str,
                text: `${tystr}发布时间：${time}，发布结果：${successStr}。`,
                html: `  <p><b>前端自动化发布系统 </b></p>
                        <p><b>${tystr}发布时间：${time}</b></p>
                        <p><b>发布结果：${successStr}</b></p>
                        <p><b>邮件接收人员：</b></p>
                        <p><b>${receiveEmail}</b><p>
                    `
            };

            let sendemail = () => {
                return new Promise(async(resolve, reject) => {
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            resolve({
                                data: error,
                                type: 'err'
                            })
                        } else {
                            resolve({
                                data: info,
                                type: 'success'
                            })
                        }
                    });
                })
            };

            let result = await sendemail();
            let desc = ''

            if (result.type === 'success') {
                desc = '邮件发送成功!'
            } else {
                desc = '邮件发送失败!'
            }

            ctx.body = util.result({
                desc: desc,
                data: result.data
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "邮件发送失败!"
            });
            return
        }
    }

};


module.exports = new Nodermailer();