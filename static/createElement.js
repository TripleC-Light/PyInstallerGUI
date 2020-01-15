// Struct show below: 
// <div class='cPathBlock cBorder'>
// 	<div class="cItem cBorder">主程式</div>
// 	<div id='iMainPath_list' class='cListBlock cBorder'>
// 		<input class="cInfoInput cBorder" type="text" id="iMainPath_path" dir='rtl' value=''/>
// 		<div id='iMainPath_option' class='cOptionDiv cBorder'>
// 			<div id='iMainPath_addBtn' class="cBtn" onclick="addPath('iMainPath')">+</div>
// 		</div>
// 	</div>
// </div>
function createPathBlock(parent, item){
	var id = item[1];
	createFrame(parent, id);
	createItem(id+'_frame', item);
	createListDiv(id+'_frame', id);

	createPath(id+'_list', id);
	createOption(id+'_list', id);
	btn.new(id, 'add');
}

function createFrame(parent, id){
	var blockId = id + '_frame';
	var parent = document.getElementById(parent);
	var block = document.createElement('div');
	block.setAttribute("id", blockId);
	block.setAttribute('class', 'cPathBlock cBorder');
	block.onmouseover = function(){ showTips(id) };
	block.onmouseleave = function(){ hideTips() };
	parent.appendChild(block);
}

function createListDiv(parent, id){
	var blockId = id + '_list';
	var parent = document.getElementById(parent);
	var block = document.createElement('div');
	block.setAttribute("id", blockId);
	block.setAttribute('class', 'cListBlock cBorder');
	parent.appendChild(block);
}

function createItem(parent, item){
	var id = item[1];
	var blockId = id + '_item';
	var parent = document.getElementById(parent);
	var block = document.createElement('div');
	block.setAttribute("id", blockId);
	block.setAttribute('class', 'cItem cBorder');
	block.innerHTML = item[0];
	parent.appendChild(block);
}

function createPath(parent, id){
	var blockId = id + '_path';
	var parent = document.getElementById(parent);
	var block = document.createElement('input');
	block.setAttribute("id", blockId);
	block.setAttribute('class', 'cInfoInput cBorder');
	block.setAttribute('type', 'text');
	block.setAttribute('dir', 'rtl');
	block.setAttribute('value', '');
	block.setAttribute('autocomplete', 'off');
	parent.appendChild(block);
}

function createOption(parent, id){
	var blockId = id + '_option';
	var parent = document.getElementById(parent);
	var block = document.createElement('div');
	block.setAttribute("id", blockId);
	block.setAttribute('class', 'cOptionDiv cBorder');
	parent.appendChild(block);
}
