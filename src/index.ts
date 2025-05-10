import { Plugin } from "siyuan";
import "./index.scss";

export default class SiyuanPluginMaterialIcon extends Plugin {
    async onload() {
        await this.checkAndInstallIconPack();
    }

    async onunload() {
        await this.uninstallIconPack();
    }

    async uninstall() {
        await this.uninstallIconPack();
    }

    async checkAndInstallIconPack() {
        const targetPath = "/data/emojis/material-icon";
        const sourcePath = "/data/plugins/siyuan-plugin-material-icon/src/material-icon";
        try {
            const response = await fetch("/api/file/readDir", {
                method: "POST",
                body: JSON.stringify({ path: targetPath }),
            });
            const data = await response.json();
            if (data.code === 0 && data.data.length > 0) {
                console.log("Material Icon 图标包存在！");
            } else {
                console.log("Material Icon 图标包不存在，开始安装...");
                var successCount = 0;
                var failCount = 0;

                try {
                    const sourceResponse = await fetch("/api/file/readDir", {
                        method: "POST",
                        body: JSON.stringify({ path: sourcePath }),
                    });
                    const sourceData = await sourceResponse.json();
                    console.log(`检测到 Material Icon 图标包包含图标个数: ${sourceData.data.length}`);
                    if (sourceData.code === 0) {
                        for (const item of sourceData.data) {
                            if (!item.isDir) {
                                const fileGetResponse = await fetch("/api/file/getFile", {
                                    method: "POST",
                                    body: JSON.stringify({ path: sourcePath + "/" + item.name }),
                                });
                                const fileContent = await fileGetResponse.text();

                                const formData = new FormData();
                                formData.append("path", targetPath + "/" + item.name);
                                const blob = new Blob([fileContent], { type: "text/plain" });
                                formData.append("file", blob, item.name);

                                const response = await fetch("/api/file/putFile", {
                                    method: "POST",
                                    body: formData,
                                });
                                const responseData = await response.json();
                                if (responseData.code === 0) {
                                    successCount += 1;
                                } else {
                                    failCount += 1
                                }
                            }
                        }
                        console.log(`Material Icon 图标包安装完成！成功：${successCount}，失败：${failCount}`);
                    }
                } catch (error) {
                    console.error("Material Icon 图标包安装出错:", error);
                }
            }
        } catch (error) {
            console.error("检测 Material Icon 图标包文件夹出错:", error);
        }
    }

    async uninstallIconPack() {
        const targetPath = "/data/emojis/material-icon";
        try {
            const response = await fetch("/api/file/readDir", {
                method: "POST",
                body: JSON.stringify({ path: targetPath }),
            });
            const data = await response.json();
            if (data.code === 0 && data.data.length > 0) {
                console.log("Material Icon 图标包存在，开始卸载...");
                try {
                    const response = await fetch("/api/file/removeFile", {
                        method: "POST",
                        body: JSON.stringify({ path: targetPath }),
                    });
                    const responseData = await response.json();
                    if (responseData.code === 0) {
                        console.log("Material Icon 图标包卸载成功");
                    } else {
                        console.log("Material Icon 图标包卸载失败");
                    }
                } catch (error) {
                    console.error("Material Icon 图标包卸载出错:", error);
                }
            } else {
                console.log("Material Icon 图标包不存在，不用卸载");
            }
        } catch (error) {
            console.error("检测 Material Icon 图标包文件夹出错:", error);
        }
    }
}
