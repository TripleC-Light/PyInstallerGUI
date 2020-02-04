class PathCtrl{
	constructor(e){
		this.mainPath = '';
		this.importPathList = [];
		this.dataPathList = [];
		this.folderPathList = [];
		this.iconPath = '';
	}

	add(id, action, path_){
		var result = new Boolean(false);
		result = false;
		if( path_ != '' ){
			if( this._checkOverlap(id, path_) ){
				if( id == 'iIcon' ){
					var iconName = path_;
					iconName = iconName.split('/');
					iconName = iconName[iconName.length-1];
					document.getElementById('iIconPic').src = '/static/tmp/' + iconName;
					this.iconPath = path_;
				}
				this._save(id, action, path_);
				result = true;
			}else{
				showError('overLapping');
			}
        }
        return result;
	}

	delete(id){
		var idGroup = id.split('_')[0];
		if( idGroup=='iMainPath'){
			this.mainPath = '';

		}else if( idGroup=='iImportPath' || idGroup=='iDataPath' || idGroup=='iFolderPath' ){
			var frameId = id.split('_')[0] + '_' + 0;
			var pathList = [];
			pathList = this._getPathList(idGroup);
			var tmpPath = document.getElementById(id+'_path').value;
			for( var i=0; i<pathList.length; i++ ){
				if( pathList[i] == tmpPath ){
					pathList.splice(i,1);
					break;
				}
			}
			this._savePathList(idGroup, pathList);
		}
		document.getElementById(id+'_path').value = '';
	}

	_save(id, action, path_){
		var idGroup = id.split('_')[0];
		if( idGroup=='iMainPath'){
	        this.mainPath = path_;

		}else if( idGroup=='iImportPath' || idGroup=='iDataPath' || idGroup=='iFolderPath' ){
			var frameId = id.split('_')[0] + '_' + 0;
			var pathList = [];
			pathList = this._getPathList(idGroup);
			if( action=='add'){
				pathList[pathList.length] = path_;

			}else if( action=='edit' ){
				var tmpPath = document.getElementById(id+'_path').value;
				console.log('tmpPath=' + tmpPath);
				for( var i=0; i<pathList.length; i++ ){
					if( pathList[i] == tmpPath ){
						pathList[i] = path_;
						break;
					}
				}
			}
    		this._savePathList(idGroup, pathList);
		}

		document.getElementById(id+'_path').value = path_;
	}

	_savePathList(idGroup, pathList){
		switch(idGroup){
			case 'importPath':
				this.importPathList = pathList;
				console.log('importPathList= ' + this.importPathList);
				return;
			case 'iDataPath':
				this.dataPathList = pathList;
				console.log('dataPathList= ' + this.dataPathList);
				return;
			case 'iFolderPath':
				this.folderPathList = pathList;
				console.log('folderPathList= ' + this.folderPathList);
				return;
		}
	}

	_checkOverlap(id, path_){
		var result = new Boolean(true);
		if( path_ == this.mainPath ){
			result = false;
		}
		console.log('path_=' + path_);
		this.importPathList.forEach(function(importPath) {
			console.log('importPath=' + importPath);
			if( path_ == importPath ){
				result = false;
			}
		})
		this.dataPathList.forEach(function(importPath) {
			if( path_ == importPath ){
				result = false;
			}
		})
		this.folderPathList.forEach(function(importPath) {
			if( path_ == importPath ){
				result = false;
			}
		})
		return result;
	}

	_getPathList(idGroup){
		switch(idGroup){
			case 'iImportPath':
				return this.importPathList;
			case 'iDataPath':
				return this.dataPathList;
			case 'iFolderPath':
				return this.folderPathList;
		}
	}

}