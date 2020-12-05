export const common_template = {
	"templateId": "1",
	"templateName": "common_template",
	"templateAliasName": "普通病例模板",
	"name": "undefined",
	"name_OPTIONS": {
		"key": "1",
		"keyAliasName": "姓名",
		"keyStyle": "Input",
		"keyRange": [],
		"keyDefaultValue": "undefined"
	},
	"sex": "undefined",
	"sex_OPTIONS": {
		"key": "2",
		"keyAliasName": "性别",
		"keyStyle": "Select",
		"keyRange": [
			{
				"id": "1",
				"name": "男"
			},
			{
				"id": "2",
				"name": "女"
			}
		],
		"keyDefaultValue": "2"
	},
	"hobby": "undefined",
	"hobby_OPTIONS": {
		"key": "3",
		"keyAliasName": "爱好",
		"keyStyle": "MultipleSelect",
		"keyRange": [
			{
				"id": "1",
				"name": "打篮球"
			},
			{
				"id": "2",
				"name": "踢足球"
			},
			{
				"id": "3",
				"name": "玩游戏"
			}
		],
		"keyDefaultValue": [
			"3",
			"2"
		]
	}
};