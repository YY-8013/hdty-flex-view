<template>
	<div class="hdty-dialog-select" :underline="underline">
		<el-input ref="inputRef" v-model="input" suffix-icon="el-icon-more" :size="size" :placeholder="placeholder"
			:disabled="disabled" :clearable="clearable"
			@mouseenter.native="showClear = !visible && $refs.inputRef.showClear"
			@mouseleave.native="showClear = !visible && $refs.inputRef.showClear" @focus="handleInputFocus"
			@clear="handleInputClear">
		</el-input>
		<el-dialog :title="title || placeholder" :visible.sync="visible" width="70%"
			:custom-class="activeDialogCustomClass" @close="handleClose" append-to-body>
			<hd-pane>
				<div class="hdty-container hdty-flex">
					<div class="hdty-jzdz" v-if="ywName || jzdz">
						{{ywName}}
						<span v-if="ywName && jzdz">:</span>
						<span style="font-size: 17px;">{{jzdz}}</span>
					</div>
					<div class="hdty-header">
						<el-form :model="queryData" :rules="rules" ref="queryRef" inline @submit.native.prevent
							@keyup.enter.native="handleQuery">
							<hd-component :model="factorData" ref="componentRef">
								<hd-expand>
									<hd-expand-header>
										<el-form-item label="街路巷(小区)名称" prop="jlxxqmc">
											<hd-input v-model="queryData.jlxxqmc" placeholder="请输入街路巷(小区)名称"
												maxlength="100"></hd-input>
										</el-form-item>
										<el-form-item label="建筑物名称" prop="jzwmc">
											<hd-input v-model="queryData.jzwmc" placeholder="请输入建筑物名称"
												maxlength="100"></hd-input>
										</el-form-item>
										<el-form-item prop="sjgsdwdm" slot="after">
											<hd-organ v-model="queryData.sjgsdwdm"
												:model-text.sync="factorData.sjgsdwdm" :filterOrg="filterOrg"
												placeholder="高级过滤：请选择管辖机构"></hd-organ>
										</el-form-item>
									</hd-expand-header>
									<hd-expand-body>
										<el-row>
											<el-form-item label="街路巷(小区)类型" prop="dzyslxdm">
												<hd-dict-select v-model="queryData.dzyslxdm"
													:dictCode="$global.dictType.addressType" multiple
													:currentValue="queryData.dzyslxdm"
													:visible-option="['41','42','43','44','45']" showMultiButton
													filterable placeholder="请选择查询条件">
												</hd-dict-select>
											</el-form-item>
										</el-row>
									</hd-expand-body>
								</hd-expand>
							</hd-component>
						</el-form>
						<div class="hdty-btn-group">
							<el-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">
								查询
							</el-button>
							<el-button icon="el-icon-delete" @click="handleClear">
								清空
							</el-button>
						</div>
					</div>
					<!--街路巷小区列表-->
					<div class="hdty-fit">
						<el-table ref="tableRef" row-key="vo.dzbm" v-loading="loading" :data="tableData" border fit
							:expand-row-keys='expands' @select="handleSelect" @select-all="handleSelectAll"
							@expand-change="handleExpandChange" height="100%">
							<el-table-column type="expand">
								<template slot-scope="props">
									<!--折叠面板-建筑物-->
									<div v-loading="jzwLoading">
										<el-collapse v-model="activeNames"
											@change="handleJzw('', props.row.children, activeNames, false,'222')"
											accordion>
											<el-collapse-item :name="item.vo.dzbm" v-for="item in props.row.children"
												:key="item.vo.dzbm" style="position: relative;">
												<template slot="title" class="collapse-title">
													<p
														style="width:80%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;display:flex;align-items: center;">
														<span
															@click.stop="handleJzw('stop', props.row.children, item.vo.dzbm, activeNames === item.vo.dzbm,'333')"
															@click="handleTick(props.row.children)">
															<el-checkbox
																v-show="item.vo.jzwlx !== '1' && componentType === '1'"
																v-model="item.vo.isTick" style="margin-right: 10px;"
																v-if="isFlagTickJzw"></el-checkbox>
														</span>
														<span v-show="item.vo.jzwlx === '1' && componentType === '1'"
															style="width: 24px;"></span>
														<img v-if="item.vo.jzwlx === '0'"
															:src="url +'/static/public/images/icon/jmzzl.png'"
															style="width: 18px;margin-right: 6px;"></img>
														<img v-if="item.vo.jzwlx === '1'"
															:src="url +'/static/public/images/icon/pf.png'"
															style="width: 18px;margin-right: 6px;"></img>
														<img v-if="item.vo.jzwlx === '3'"
															:src="url +'/static/public/images/icon/syl.png'"
															style="width: 18px;margin-right: 6px;"></img>
														<img v-if="item.vo.jzwlx === '6'"
															:src="url +'/static/public/images/icon/szytl.png'"
															style="width: 18px;margin-right: 6px;"></img>
														<img v-if="item.vo.jzwlx === '7'"
															:src="url +'/static/public/images/icon/lpjzw.png'"
															style="width: 18px;margin-right: 6px;"></img>
														{{item.vo.dzmcDzqc}}
													</p>
													<el-button name="detail" style="z-index:9999"
														@click.prevent="handleJzw('stop' ,props.row.children, item.vo.dzbm, activeNames === item.vo.dzbm,'444')"
														class="greenbtn foldunfoldbtn">{{ activeNames === item.vo.dzbm ? "折叠" : "展开"}}
													</el-button>
												</template>
												<building-diagram ref="buildingRef" :isYw="isYw" :sjgsdwdm="sjgsdwdm"
													:sjgsdwdmName="sjgsdwdmName" :componentType="componentType"
													@handleSelectRoomList="handleSelectRoomList"
													@handleSelectList="handleSelectList"
													@handleSelectJzw="handleSelectJzw"
													@handleClearJlxAndJzw="handleClearJlxAndJzw"
													@handleSelectUnitList="handleSelectUnitList"
													@handleSelectJlxPf="handleSelectJlxPf"></building-diagram>
											</el-collapse-item>
										</el-collapse>
									</div>
									<!--没有建筑物-->
									<div class="hd-zwsj" v-if="!props.row.children || props.row.children.length === 0">
										暂无数据</div>
								</template>
							</el-table-column>
							<el-table-column prop="vo.jlxxqmcQc" label="街路巷(小区)全称" sortable="custom"
								header-align="center" show-overflow-tooltip min-width="500">
							</el-table-column>
							<el-table-column prop="vox.dzyslxdm" label="街路巷(小区)类型" sortable="custom"
								header-align="center" min-width="200">
							</el-table-column>
							<el-table-column v-if="componentType === '1'" type="selection" reserve-selection
								align="center" width="50">
							</el-table-column>
						</el-table>
					</div>
					<div class="hdty-footer">
						<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:current-page="pageOptions.current" :page-sizes="pageOptions.sizes"
							:page-size="pageOptions.size" layout="total, sizes, prev, pager, next, jumper"
							:total="pageOptions.total">
						</el-pagination>
					</div>
				</div>
			</hd-pane>
			<span slot="footer" class="hdty-dialog-footer">
				<cite class="hdty-float-left">当前选择：<el-tag v-if="activeTag"
						type="success">{{ activeTag }}</el-tag></cite>
				<el-button type="warning" @click="emptyAccount" v-if="isShowEmptyAccount"
					title="提示：如果标准地址已拆迁，选此项">空挂户</el-button>
				<el-button @click="cancelForm">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		hdComponent,
		hdList,
		hdForm,
		hdMethod
	} from "@/utils/util-framework";
	import {
		jlxPage,
		jzwPage
	} from './api';
	import BuildingDiagram from './BuildingDiagram'
	export default {
		name: "index",
		provide() {
			return {
				hdBuilding: this
			};
		},
		mixins: [hdComponent, hdList, hdForm, hdMethod],
		components: {
			BuildingDiagram,
		},
		props: {
			prop: String,
			// 居住地址
			jzdz: {
				type: [String],
				default: ''
			},
			// 所属街路巷编码
			ssjlxxqDzbm: {
				type: String,
				default: ''
			},
			// 绑定值
			value: {
				type: [Number, String, Array],
				default: ''
			},
			// 绑定值文本
			modelText: {
				type: [Number, String, Array],
				default: ''
			},
			// 大小（medium / small / mini）
			size: {
				type: String,
				default: ''
			},
			// 会话标题
			title: {
				type: String,
				default: ''
			},
			// 会话层大小（large/ medium / small / mini / fit）
			dialogSize: {
				type: String,
				default: 'medium'
			},
			// 水印
			placeholder: {
				type: String,
				default: '关联标准地址'
			},
			// 禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// 清空
			clearable: {
				type: Boolean,
				default: true,
			},
			// 宽度随内容适应
			adaptation: {
				type: Boolean,
				default: false
			},
			// 显示边框
			underline: {
				type: Boolean,
				default: false
			},
			// 业务是否允许选择楼层、建筑物（是：支持楼层多选，建筑物单选；否：只支持选择房间）
			isYw: {
				type: Boolean,
				default: false
			},
			ywName: {
				type: String,
				default: '待签收人员居住地址'
			},
			isShowEmptyAccount: {
				type: Boolean,
				default: false
			},
			// 组件类型 1.查询组件 2.标准地址选择组件
			componentType: {
				type: [String],
				default: '2'
			},
			// 是否显示建筑物以下
			isShowJzwHome: {
				type: Boolean,
				default: true
			},
			// 管辖机构支持传参
			sjgsdwdm: {
				type: [String],
				default: ''
			},
			sjgsdwdmName: {
				type: [String],
				default: ''
			},
			// 绑定值的字段名
			valueField: {
				type: String,
				default: 'dzbm'
			},
			// 绑定值文本的字段名
			labelField: {
				type: String,
				default: 'ssjlxxqDzbm'
			},
		},
		data() {
			return {
				// 绑定值
				input: this.modelText, // input接收父组件传来的modelText值
				// 绑定值
				currentValue: this.value,
				// 查询
				queryData: {
					jlxxqmc: '',
					jzwmc: '',
					dzyslxdm: [],
					sjgsdwdm: '',
					andor: this.$app.factorOptions.logicOpe.and
				},
				// 查询扩展
				factorData: {
					jzwmcFilterFactor: this.$app.factorOptions.matchOpe.between,
					sjgsdwdm: '',
				},
				// 查询条件机构过滤
				filterOrg: '',
				// 验证
				rules: {},
				// 显示清除按钮
				showClear: '',
				// 加载中
				loading: false,
				// 显示Dialog
				visible: false,
				// 折叠面板
				activeNames: '',
				// 当前选中建筑物信息
				activeJzwinfo: {
					label: '',
					dzbm: '',
					jzwlx: '',
          bdLat:'',
          bdLon:'',
          gpsLat:'',
          gpsLon:'',
					jzwbm: '',
					dzmcSsxqdm: '',
					dzmcSsxqdmText: '',
					ssjlxxqDzbm: '',
					sjgsdwdm: '',
				},
				// 基地址
				url: process.env.NODE_PATH,
				// 街路巷小区列表数据
				tableData: [],
				jzwLoading: false,
				// 当前展开行的id
				expands: [],
				// 当前选中的街路巷编码下标
				activedIndexJlx: '',
				// 当前选中的建筑物编码下标
				activedIndexJzw: '',
				// 标识是否勾选了建筑物
				isFlagTickJzw: true,
				// 标识折叠面板当前是否展开
				isOpen: false,
				// 记录此次打开弹框的值
				currentOpenLabel: ''
			}
		},
		computed: {
			activeDialogCustomClass() {
				if (this.dialogSize === 'large') {
					return 'hdty-dialog-large';
				} else if (this.dialogSize === 'medium') {
					return 'hdty-dialog-medium';
				} else if (this.dialogSize === 'small') {
					return 'hdty-dialog-small';
				} else if (this.dialogSize === 'mini') {
					return 'hdty-dialog-mini';
				} else if (this.dialogSize === 'fit') {
					return 'hdty-dialog-fit';
				} else {
					return this.dialogSize;
				}
			},
			activeSuffixIcon() {
				return this.$refs.inputRef.$el.querySelector('.el-input__suffix-inner').querySelectorAll(
				'.el-input__icon');
			},
			activeTag() {
				return this.input;
			},
		},
		watch: {
			value: {
				handler(val) {
					this.doAdaptation();
					if (this.$utilStr.isEmpty(val)) {
						this.input = '';
					}
					this.pageOptions.current = 1;
				},
				immediate: true
			},
			modelText: {
				handler(val) {
					this.input = val;
					if (this.$utilStr.isEmpty(val) && !this.$utilStr.isEmpty(this.currentValue)) {
						val = this.currentValue;
					}
				},
				immediate: true
			},
			showClear: {
				handler(val) {
					if (val) {
						[].forEach.call(this.activeSuffixIcon, e => {
							if (!e.className.includes('el-input__clear')) {
								e.style.display = 'none';
							}
						});
					} else {
						[].forEach.call(this.activeSuffixIcon, e => {
							e.style.display = '';
						});
					}
				},
				immediate: false
			}
		},
		methods: {
			// input获得焦点
			handleInputFocus() {
				let _this = this;
				_this.visible = true;
				_this.activeNames = '';
				_this.$set(_this.activeJzwinfo, _this.valueField, _this.value);
				_this.$set(_this.activeJzwinfo, 'label', _this.modelText);
				_this.currentOpenLabel = _this.modelText;
				// 如果父级传了管辖机构，则给管辖机构赋值
				// 备注：责任区查派出所的数据时使用
				if (_this.sjgsdwdm) {
					// _this.queryData.sjgsdwdm = _this.sjgsdwdm;
					_this.queryData.sjgsdwdm = _this.sjgsdwdm.substr(0, 8) + '0000';
					_this.factorData.sjgsdwdm = _this.sjgsdwdmName;
					_this.filterOrg = _this.$utilPublic.getUserInfo().orgId.substr(0, 4) + '00000000';
				}
				_this.$emit('currentOpening', _this);
				// 清空刚选择的
				if (this.componentType === '1') {
					_this.loadList();
					if (_this.$refs.tableRef) {
						_this.$refs.tableRef.clearSelection();
						_this.input = '';
						_this.activeTag = '';
						_this.expands = [];
					}
				} else {
					if (_this.tableData.length === 0 || _this.activeTag === '') {
						_this.loadList();
						_this.expands = [];
					}
					// if(_this.activedIndexJlx && _this.tableData.length > 0){
					// _this.input = '';
					// if(_this.activedIndexJzw > -1){
					// 显示房态图
					// if(_this.isYw){
					//   _this.$refs.buildingRef[this.activedIndexJzw].visible = true;
					//   _this.$refs.buildingRef[this.activedIndexJzw].jzwInfo.dzbm = this.activeNames;
					//   _this.$refs.buildingRef[this.activedIndexJzw].jzwInfo.jzwlx = this.tableData[this.activedIndexJlx].children[this.activedIndexJzw].vo.jzwlx;
					//   _this.$refs.buildingRef[this.activedIndexJzw].jzwmc = this.queryData.jzwmc;
					//   _this.$refs.buildingRef[this.activedIndexJzw].roomLabels = [];
					//   _this.$refs.buildingRef[this.activedIndexJzw].roomValues = [];
					//   _this.$refs.buildingRef[this.activedIndexJzw].floorLabels = [];
					//   _this.$refs.buildingRef[this.activedIndexJzw].floorValues = [];
					//   _this.$refs.buildingRef[this.activedIndexJzw].buildingLabels = [];
					//   _this.$refs.buildingRef[this.activedIndexJzw].buildingValues = [];
					//   _this.$refs.buildingRef[this.activedIndexJzw].loadDiagram();
					// }
					// }
					// }else{
					//   _this.loadList();
					// }
				}
			},
			// 获取数据列表
			loadList() {
				let _this = this;
				_this.loading = true;
				// 参数
				let dataParams = {
					..._this.factorData,
					..._this.queryData,
					..._this.pageOptions,
				};
				jlxPage(dataParams).then(response => {
					// 响应成功回调
					let {
						success,
						data
					} = response.data;
					if (success) {
						_this.tableData = data.records;
						_this.pageOptions.total = data.total;
					}
				}).catch(error => {
					// 响应错误回调
					console.error(error);
				}).finally(() => {
					_this.$refs.tableRef.doLayout();
					_this.loading = false;
				});
			},
			handleExpandChange(row, expanded) {
				let _this = this;
				if (_this.activedIndexJlx !== '' && _this.tableData[_this.activedIndexJlx].vo.dzbm === row.vo.dzbm) {
					_this.expands = [];
					_this.activedIndexJlx = '';
					return;
				}
				_this.expands = [row.vo.dzbm];
				if (expanded.findIndex(e => e.vo.dzbm === row.vo.dzbm) > -1) {
					_this.loading = true;
					_this.jzwLoading = true;
					// 参数
					let dataParams = {
						..._this.factorData,
						..._this.queryData,
						ssjlxxqDzbm: row.vo.dzbm,
						businessType: 1,
						size: 1000,
						current: 1,
						sizes: [10, 20, 50, 100]
					}
					// Lambda写法
					jzwPage(dataParams).then(response => {
						//响应成功回调
						let {
							success,
							data
						} = response.data;
						if (success) {
							let index = _this.tableData.findIndex(e => e.vo.dzbm === row.vo.dzbm);
							if (index > -1) {
								// 处理是否选中标识字段
								data.records.forEach(e => {
									e.vo.isTick = false;
								})
								_this.tableData[index].children = data.records;
								_this.activedIndexJlx = index;
							}
						}
					}).catch(error => {
						// 响应错误回调
						console.log(error);
					}).finally(() => {
						_this.jzwLoading = false;
						_this.loading = false;
					});
				}
			},
			// 建筑物多选处理
			handleTick(selection) {
				let jlxdzbmArry = [];
				let jlxlabelArry = [];
				setTimeout(() => {
					selection.forEach(e => {
						if (e.vo.isTick) {
							jlxdzbmArry.push(e.vo.dzbm);
							jlxlabelArry.push(e.vo.jzwmc);
						}
					})
					this.input = jlxlabelArry.toString();
					this.activeJzwinfo.dzbm = jlxdzbmArry.toString();
					this.activeJzwinfo.label = jlxlabelArry.toString();
					this.activeJzwinfo.type = '3';
					this.isFlagTickJzw = false;
					this.isFlagTickJzw = true;
					// 取消街路巷勾选
					this.$refs.tableRef.clearSelection()
					// 清空子页面勾选的单元、楼层、房间
					if (this.activedIndexJzw) {
						this.$refs.buildingRef[this.activedIndexJzw].clearAllXft();
					}
				}, 100);
			},
			// 街路巷多选处理
			handleSelect(selection, row) {
				let jlxdzbmArry = [];
				let jlxlabelArry = [];
				selection.forEach(e => {
					jlxdzbmArry.push(e.vo.dzbm);
					jlxlabelArry.push(e.vo.jlxxqmc);
				})
				this.input = jlxlabelArry.toString();
				this.activeJzwinfo.dzbm = jlxdzbmArry.toString();
				this.activeJzwinfo.label = jlxlabelArry.toString();
				this.activeJzwinfo.type = '4';
				if (this.activedIndexJlx) {
					// 取消建筑物勾选
					this.tableData[this.activedIndexJlx].children.forEach(e => {
						e.vo.isTick = false;
					})
					this.isFlagTickJzw = false;
					this.isFlagTickJzw = true;
					// 清空子页面勾选的单元、楼层、房间
					this.$refs.buildingRef[this.activedIndexJzw].clearAllXft();
				}

			},
			// 街路巷全选处理
			handleSelectAll(selection) {
				let jlxdzbmArry = [];
				let jlxlabelArry = [];
				selection.forEach(e => {
					jlxdzbmArry.push(e.vo.dzbm);
					jlxlabelArry.push(e.vo.jlxxqmc);
				})
				this.input = jlxlabelArry.toString();
				this.activeJzwinfo.dzbm = jlxdzbmArry.toString();
				this.activeJzwinfo.label = jlxlabelArry.toString();
				this.activeJzwinfo.type = '4';
				if (this.activedIndexJlx) {
					// 取消建筑物勾选
					this.tableData[this.activedIndexJlx].children.forEach(e => {
						e.vo.isTick = false;
					})
					this.isFlagTickJzw = false;
					this.isFlagTickJzw = true;
					// 清空子页面勾选的单元、楼层、房间
					this.$refs.buildingRef[this.activedIndexJzw].clearAllXft();
				}
			},
			// 查询
			handleQuery() {
				let _this = this;
				_this.$refs.queryRef.validate((valid) => {
					if (valid) {
						_this.expands = [];
						_this.activedIndexJlx = '';
						_this.pageOptions.current = 1;
						_this.loadList(1);
					}
				});
			},
			// 清空
			handleClear() {
				if (this.$refs.queryRef) {
					this.$refs.queryRef.resetFields();
				}
				this.factorData.ssjlxxqDzbm = '';
				this.tableData = [];
				this.activeNames = '';
				this.activedIndexJlx = '';
				this.input = '';
			},
			// 清空所勾选的街路巷和建筑物
			handleClearJlxAndJzw() {
				// 取消街路巷勾选
				this.$refs.tableRef.clearSelection()
				// 取消建筑物勾选
				this.tableData[this.activedIndexJlx].children.forEach(e => {
					e.vo.isTick = false;
				})
				this.isFlagTickJzw = false;
				this.isFlagTickJzw = true;
			},
			// input清空
			handleInputClear() {
				this.$emit('input', '');
				this.$emit('update:modelText', '');
				this.$emit('currentChanged', '');
				this.triggerValidateField();
				// 清空当前选择建筑物
				this.activeJzwinfo = {
					dzbm: '',
					label: '',
					jzwlx: '',
          bdLat:'',
          bdLon:'',
          gpsLat:'',
          gpsLon:'',
					jzwbm: '',
					type: '', // 1:房间 2.楼层 3.建筑物 4.街路巷
					dzmcSsxqdm: '',
					dzmcSsxqdmText: '',
					ssjlxxqDzbm: '',
					sjgsdwdm: '',
				}
				// 清空当前建筑物列表
				this.tableData = [];
				this.activeNames = '';
				this.activedIndexJlx = '';
				this.handleClear();
			},
			// 提交
			submitForm() {
				if (this.currentOpenLabel === this.activeJzwinfo.label) {
					this.visible = false;
					return false;
				}
				if (this.activeTag) {
					if (this.activeJzwinfo.dzbm && this.activeJzwinfo.dzbm.split(',').length > 1000) {
						this.$message({
							showClose: true,
							customClass: 'is-fixed',
							message: '标准地址搜索不能超过最大限制1000条',
							type: 'error'
						});
						return;
					}
					this.visible = false;
					this.$emit('input', this.activeJzwinfo[this.valueField]); //触发 input 事件，并传入新值
					this.$emit('update:modelText', this.activeJzwinfo.label);
					if (this.isShowEmptyAccount) {
						// 是否空挂户
						this.activeJzwinfo.isEmptyAccount = 0;
					}
					console.log('=====================', this.activeJzwinfo);

					this.$emit('handleGlbzdz', this.activeJzwinfo);
				} else {
					this.$message({
						showClose: true,
						customClass: 'is-fixed',
						message: '您还没有选择标准地址，不允许提交！',
						type: 'warning'
					});
				}
			},
			// 取消
			cancelForm() {
				this.visible = false;
				this.resetForm();
			},
			// 重置
			resetForm() {
				this.pageOptions.current = 1;
			},
			// 对宽度重新适应
			doAdaptation() {
				if (this.adaptation) {
					this.$nextTick(() => {
						let inputRef = this.$refs.inputRef;
						if (inputRef) {
							let text;
							if (inputRef.value) {
								text = inputRef.value;
							} else if (this.placeholder) {
								text = this.placeholder;
							}
							let inputBoxEl = inputRef.$el;
							let inputEl = inputBoxEl.querySelector('.el-input__inner');
							let inputStyles = this.$utilElem.getStyle(inputEl);
							let borderSize = parseFloat(inputStyles.borderLeftWidth) + parseFloat(inputStyles
								.borderRightWidth);
							let paddingSize = parseFloat(inputStyles.paddingLeft) + parseFloat(inputStyles
								.paddingRight);
							inputBoxEl.style.width = Math.ceil(this.$utilElem.getTextScreenWidth(text, inputStyles
								.fontSize) + borderSize + paddingSize) + 'px';
						}
					});
				}
			},
			// 打开建筑物查看房态图
			handleJzw(flag, jzwList, dzbm, isOpen, type) {
				if (flag === 'stop') {
					return;
				} else {
					if (isOpen) {
						// 折叠
						return;
					} else {
						// 展开
						let index = jzwList.findIndex(e => e.vo.dzbm === dzbm);
						if (index > -1) {
							this.activedIndexJzw = index;
							// 显示房态图
							this.$refs.buildingRef[this.activedIndexJzw].visible = true;
							this.$refs.buildingRef[this.activedIndexJzw].jzwInfo.dzbm = dzbm;
							this.$refs.buildingRef[this.activedIndexJzw].jzwInfo.jzwlx = jzwList[index].vo.jzwlx;
							this.$refs.buildingRef[this.activedIndexJzw].jzwmc = this.queryData.jzwmc;
							this.$refs.buildingRef[this.activedIndexJzw].isShowJzwHome = this.isShowJzwHome;
							this.$refs.buildingRef[this.activedIndexJzw].loadDiagram();
						}
					}
				}
			},
			// 回显当前选择
			handleSelectRoomList(roomLabels, roomValues) {
				let index = this.tableData[this.activedIndexJlx].children.findIndex(e => e.vo.dzbm === this.activeNames);
				if (index > -1 && roomLabels.length > 0 && roomValues.length > 0) {
          console.log('handleSelectRoomList',this.tableData[this.activedIndexJlx].children[index]);
          
					this.input = this.tableData[this.activedIndexJlx].children[index].vo.dzmcDzqc + roomLabels.toString();
					this.activeJzwinfo.dzbm = roomValues.toString();
					this.activeJzwinfo.label = this.tableData[this.activedIndexJlx].children[index].vo.dzmcDzqc +
						roomLabels.toString();
					this.activeJzwinfo.jzwlx = this.tableData[this.activedIndexJlx].children[index].vo.jzwlx;
          this.activeJzwinfo.bdLat = this.tableData[this.activedIndexJlx].children[index].vo.bdLat;
					this.activeJzwinfo.bdLon = this.tableData[this.activedIndexJlx].children[index].vo.bdLon;
					this.activeJzwinfo.gpsLat = this.tableData[this.activedIndexJlx].children[index].vo.gpsLat;
					this.activeJzwinfo.gpsLon = this.tableData[this.activedIndexJlx].children[index].vo.gpsLon;
					this.activeJzwinfo.jzwbm = this.tableData[this.activedIndexJlx].children[index].vo.jzwlx === '1' ?
						roomValues.toString() : this.activeNames;
					this.activeJzwinfo.dzmcSsxqdm = this.tableData[this.activedIndexJlx].children[index].vo.dzmcSsxqdm;
					this.activeJzwinfo.dzmcSsxqdmText = this.tableData[this.activedIndexJlx].children[index].vox
					.dzmcSsxqdm;
					this.activeJzwinfo.ssjlxxqDzbm = this.tableData[this.activedIndexJlx].children[index].vo.ssjlxxqDzbm;
					this.activeJzwinfo.sjgsdwdm = this.tableData[this.activedIndexJlx].children[index].vo.sjgsdwdm;
					// 处理平房多选，平房属于建筑物
					if (this.tableData[this.activedIndexJlx].children[index].vo.jzwlx === '1') {
						this.activeJzwinfo.type = '3'; // 建筑物
					} else {
						this.activeJzwinfo.type = '1'; // 房间
					}
					this.updateActiveInfo();
				} else {
					this.resetValue();
				}
			},
			// 会先当前选中的单元
			handleSelectUnitList(unitLabels, unitValue) {
				if (this.activedIndexJzw && this.activedIndexJzw > -1 && unitLabels.length > 0 && unitValue.length > 0) {

					this.input = this.tableData[this.activedIndexJlx].children[this.activedIndexJzw].vo.dzmcDzqc +
						unitLabels.toString();
					this.activeJzwinfo.dzbm = unitValue.toString();
					this.activeJzwinfo.label = this.tableData[this.activedIndexJlx].children[this.activedIndexJzw].vo
						.dzmcDzqc + unitLabels.toString();
					this.activeJzwinfo.type = '5'; // 单元
				} else {
					this.resetValue();
				}
			},
			// 回显当前选中楼层
			handleSelectList(floorLabels, floorValues) {
				let index = this.tableData[this.activedIndexJlx].children.findIndex(e => e.vo.dzbm === this.activeNames);
				if (index > -1 && floorLabels.length > 0 && floorValues.length > 0) {
          console.log('handleSelectList',this.tableData[this.activedIndexJlx].children[index]);

					this.input = this.tableData[this.activedIndexJlx].children[index].vo.dzmcDzqc + floorLabels.toString();
					this.activeJzwinfo.dzbm = floorValues.toString();
					this.activeJzwinfo.label = this.tableData[this.activedIndexJlx].children[index].vo.dzmcDzqc +
						floorLabels.toString();
					this.activeJzwinfo.jzwlx = this.tableData[this.activedIndexJlx].children[index].vo.jzwlx;
          this.activeJzwinfo.bdLat = this.tableData[this.activedIndexJlx].children[index].vo.bdLat;
					this.activeJzwinfo.bdLon = this.tableData[this.activedIndexJlx].children[index].vo.bdLon;
					this.activeJzwinfo.gpsLat = this.tableData[this.activedIndexJlx].children[index].vo.gpsLat;
					this.activeJzwinfo.gpsLon = this.tableData[this.activedIndexJlx].children[index].vo.gpsLon;
					this.activeJzwinfo.ssjlxxqDzbm = this.tableData[this.activedIndexJlx].children[index].vo.ssjlxxqDzbm;
					this.activeJzwinfo.sjgsdwdm = this.tableData[this.activedIndexJlx].children[index].vo.sjgsdwdm;
					this.activeJzwinfo.dzmcSsxqdm = this.tableData[this.activedIndexJlx].children[index].vo.dzmcSsxqdm;
					this.activeJzwinfo.dzmcSsxqdmText = this.tableData[this.activedIndexJlx].children[index].vox
					.dzmcSsxqdm;
					this.activeJzwinfo.jzwbm = this.activeNames;
					this.activeJzwinfo.type = '2'; // 楼层
					this.updateActiveInfo();
				} else {
					this.resetValue();
				}
			},
			// 会先当前选中的街路巷下的平房
			handleSelectJlxPf() {
				this.input = this.tableData[this.activedIndexJlx].vo.jlxxqmcQc;
				this.activeJzwinfo.dzbm = this.tableData[this.activedIndexJlx].vo.dzbm;
				this.activeJzwinfo.label = this.tableData[this.activedIndexJlx].vo.jlxxqmcQc;
				this.activeJzwinfo.type = '41'; // 街路巷下的平房
			},
			// 回显当前选中建筑物
			handleSelectJzw(buildingLabels, buildingValues) {
				let index = this.tableData[this.activedIndexJlx].children.findIndex(e => e.vo.dzbm === this.activeNames);
				if (index > -1) {
          console.log('handleSelectJzw',this.tableData[this.activedIndexJlx].children[index]);

					this.input = this.tableData[this.activedIndexJlx].children[index].vo.dzmcDzqc;
					this.activeJzwinfo.dzbm = buildingValues.toString();
					this.activeJzwinfo.label = this.tableData[this.activedIndexJlx].children[index].vo.dzmcDzqc;
					this.activeJzwinfo.jzwlx = this.tableData[this.activedIndexJlx].children[index].vo.jzwlx;
					this.activeJzwinfo.bdLat = this.tableData[this.activedIndexJlx].children[index].vo.bdLat;
					this.activeJzwinfo.bdLon = this.tableData[this.activedIndexJlx].children[index].vo.bdLon;
					this.activeJzwinfo.gpsLat = this.tableData[this.activedIndexJlx].children[index].vo.gpsLat;
					this.activeJzwinfo.gpsLon = this.tableData[this.activedIndexJlx].children[index].vo.gpsLon;
					this.activeJzwinfo.ssjlxxqDzbm = this.tableData[this.activedIndexJlx].children[index].vo.ssjlxxqDzbm;
					this.activeJzwinfo.sjgsdwdm = this.tableData[this.activedIndexJlx].children[index].vo.sjgsdwdm;
					this.activeJzwinfo.jzwbm = this.activeNames;
					this.activeJzwinfo.type = '3'; // 建筑物
					this.updateActiveInfo();
				}
			},
			// 更新当前选中信息
			updateActiveInfo() {
				// 
				console.log('activeJzwinfo', this.activeJzwinfo);
			},
			// 重置值
			resetValue() {
				this.input = '';
				this.activeJzwinfo.dzbm = '';
				this.activeJzwinfo.label = '';
				this.activeJzwinfo.jzwlx = '';
				this.activeJzwinfo.bdLat = '';
				this.activeJzwinfo.bdLon = '';
				this.activeJzwinfo.gpsLat = '';
				this.activeJzwinfo.gpsLon = '';
				this.activeJzwinfo.jzwbm = '';
				this.activeJzwinfo.dzmcSsxqdm = '';
				this.activeJzwinfo.dzmcSsxqdmText = '';
				this.activeJzwinfo.ssjlxxqDzbm = '';
				this.activeJzwinfo.sjgsdwdm = '';
			},
			// 选择空挂户
			emptyAccount() {
				// 参数
				let dataParams = {};
				return false;
				getEmptyAddress(dataParams).then(response => {
					//响应成功回调
					let {
						success,
						data
					} = response.data;
					if (success) {
						if (data) {
							this.visible = false;
							this.$emit('input', data[this.valueField]); //触发 input 事件，并传入新值
							this.$emit('update:modelText', data.dzmcDzqc);
							this.activeJzwinfo = {
								label: data.dzmcDzqc,
								dzbm: data.dzbm,
								jzwlx: data.jzwlx,
								jzwbm: data.dzbm,
								dzmcSsxqdm: data.dzmcSsxqdm,
								dzmcSsxqdmText: '',
								ssjlxxqDzbm: data.ssjlxxqDzbm,
								sjgsdwdm: data.sjgsdwdm,
								isEmptyAccount: '1',
							};
							this.$emit('handleGlbzdz', this.activeJzwinfo);
						} else {
							this.$message({
								showClose: true,
								customClass: 'is-fixed',
								message: '您还没有空挂户没查询到地址信息，不允许提交！',
								type: 'warning'
							});
						}
					}
				}).catch(error => {
					//响应错误回调
					console.error(error);
				})
			},
			handleClose() {
				if (this.activeTag) {
					if (this.activeJzwinfo.dzbm && this.activeJzwinfo.dzbm.split(',').length > 1000) {
						this.$message({
							showClose: true,
							customClass: 'is-fixed',
							message: '标准地址搜索不能超过最大限制1000条',
							type: 'error'
						});
						return;
					}
					this.visible = false;
					this.$emit('input', this.activeJzwinfo[this.valueField]); //触发 input 事件，并传入新值
					this.$emit('update:modelText', this.activeJzwinfo.label);
				} else {
					this.handleInputClear();
				}
			}
		}
	}
</script>

<style scoped>
	.hdty-jzdz {
		font-size: 15px;
		color: #FF9400;
		font-weight: bolder;
		padding-bottom: 10px;
	}

	.hd-zwsj {
		width: 100%;
		text-align: center;
	}

	/* title*/
	.no-watermark #HDTY_watermark {
		display: none !important;
	}

	.Title_gr {
		color: #35cc7d !important;
		margin-bottom: 5px;
		margin-left: 15px;
		margin-bottom: 10px;
	}

	.Row_title_gr {
		background: #0099ff;
		color: #ffffff;
		border-radius: 5px;
		padding: 3px 0;
		text-indent: 16px;
	}

	.greenbtn {
		background: #66cc66 !important;
		color: #fff !important;
	}

	.greenbtn:hover {
		background: #85e185 !important;
	}

	.el-collapse-item__content>div {
		margin-left: 18px;
	}

	/* 单元 */
	.Btn_dyh {
		display: block;
		overflow: hidden;
		min-width: 50px;
		height: 26px;
		text-align: center;
		line-height: 26px;
		background: #ff9999;
		color: #ffffff;
		margin: 0 16px 10px 5px;
		cursor: pointer;
		float: left;
		font-size: 12px;
	}

	.Btn_dyh:hover {
		background: #f3cdcd;
	}

	.Btn_div {
		display: block;
		overflow: hidden;
	}

	/* 楼层 */
	.Btn_lh {
		display: block;
		overflow: hidden;
		/* padding: 1px 14px; */
		background: #07c160;
		color: #ffffff;
		margin: 0 21px 10px 5px;
		cursor: pointer;
		min-width: 50px;
		text-align: center;
		height: 26px;
		line-height: 26px;
		float: left;
		font-size: 12px;
	}

	.Btn_lh:hover {
		background: #85e4b2;
	}

	.dyh_btn {
		margin: 10px 0 15px 0;
		display: block;
		overflow: hidden;
	}

	/* 房号循环 */
	.house_btn {
		float: left;
		margin: 0 10px 5px 12px;
		text-align: center;
		color: #646464;
	}

	/* 手风琴title */
	.el-collapse-item__header>i {
		display: none !important;
	}

	.foldunfoldbtn {
		position: absolute;
		right: 20px;
	}

	/deep/ .el-table__body-wrapper {
		overflow: auto !important;
	}
</style>