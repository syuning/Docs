1. alert的更改涉及到了json文件和python脚本
	查找是请使用find -name *.json和find -name alert*.py查找
2. 首先执行mkdir.sh文件
3. 之后执行cp.sh文件
	注意要备份拷贝过来的文件夹，以保证以后能还原
	具体方法为复制一份文件夹到backup下面
4. 执行翻译py脚本 AlertsReplaceTool.py
5. 执行native.sh将json文件翻译为可识别的ascii编码形式，在py脚本第二行中添加一行utf8命令
6. 转码完成之后执行cpback.sh文件
