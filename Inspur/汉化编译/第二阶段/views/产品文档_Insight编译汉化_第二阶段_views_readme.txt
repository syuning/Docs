1. 目前只用到了hive，yarn，tez，file所以只修改这几个文件的view.xml
2. 首先执行mkdir.sh文件
3. 之后执行cp.sh文件
	注意要备份拷贝过来的文件夹，以保证以后能还原
	具体方法为复制一份文件夹到backup下面
4. 执行翻译py脚本 ViewsReplaceTool.py
5. 翻译完成之后执行cpback.sh文件
