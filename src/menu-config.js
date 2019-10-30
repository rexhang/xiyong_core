const menuList = [
	{
		title: '药材库房管理',
		path: '/admin/medicine',
		icon: 'medicine',
		children: [
			{
				title: '药材列表',
				path: '/admin/medicine/drug',
			},
			{
				title: '药方列表',
				path: '/admin/medicine/drug-group',
			},
			{
				title: '原料库房',
				path: '/admin/medicine/raw-material',
			},
			{
				title: '药局库房',
				path: '/admin/medicine/raw-material1',
			},
			{
				title: '门诊库房',
				path: '/admin/medicine/raw-material3',
			},
			{
				title: '供应商列表',
				path: '/admin/medicine/supplier',
			}
		]
	},
	{
		title: '处理方式管理',
		path: '/admin/style',
		icon: 'style',
		children: [
			{
				title: '诊断结果列表',
				path: '/admin/style/diagnosis-list',
			},
			{
				title: '服用方式列表',
				path: '/admin/style/take-list',
			}
		]
	},
	{
		title: '穴位管理',
		path: '/admin/acupuncture-point',
		icon: 'acupuncture-point',
		children: [
			{
				title: '穴位列表',
				path: '/admin/acupuncture-point/acupuncture-point-list',
			}
		]
	},
	{
		title: '病历管理',
		path: '/admin/medical-record',
		icon: 'medical-record',
		children: [
			{
				title: '病历报告查询',
				path: '/admin/medical-record/report-list',
			}
		]
	},
	{
		title: '系统管理',
		path: '/admin/system',
		icon: 'system',
		children: [
			{
				title: '消息中心',
				path: '/admin/system/message',
			}
		]
	},
	{
		title: '处方核销管理',
		path: '/admin/writeoff',
		icon: 'writeoff',
		children: [
			{
				title: '处方列表',
				path: '/admin/writeoff/writeoff-list',
			}
		]
	},
	{
		title: '医疗系统',
		path: '/admin/core',
		icon: 'core',
		children: [
			{
				title: '门诊就诊系统',
				path: '/admin/core/prescribe',
			}
		]
	}
];

export default menuList;