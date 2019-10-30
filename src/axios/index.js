/**
 * @author Rexhang(GuHang)
 * @date 2019-03-02 16:30
 * @Description: JsonP跨域模式 -> 使用参考 QExport 模块
*/

import JsonP from 'jsonp';

export default class Axios {
	static jsonp(options){
		return new Promise((resolve, reject)=>{
			JsonP(options.url, {
				param: 'callback'
			}, (err, response)=>{
				if (!err){
					if (response.status === 'success'){
						resolve(response);
					} else {
						reject('response.status: '+response.status);
					}
				}
			});
		});
	}
}