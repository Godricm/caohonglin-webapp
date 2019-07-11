<template> 
	<view>  
		
		<x-form :rules="rules" :model="form" ref="ruleForm" @submit="formSubmit">
			<image style="width: 100%;" src="/static/images/0.jpg" mode="scaleToFill"></image> 
			<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">姓名</view> 
				 <x-input type="text" :value="form.customerName" prop="input"   class="uni-input" name="customerName"  focus placeholder="请填写您的姓名" /> 
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">手机</view>
				<x-input type="text" :value="form.mobile" class="uni-input" prop="input"  name="mobile" placeholder="请填写您的手机号码" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">预约到访人数</view> 
				<picker @change="bindPickerChange" name="linkNum" :value="index" :range="array" range-key="name">
					<view class="uni-input">{{array[index].name}}</view>
				</picker> 
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">预约到访日期</view>
				<input class="uni-input" @focus="open" name="linkDate" :value="timeData.fulldate" placeholder="请选择您的到访日期" />
					<view v-if="show" class="calendar-mask" @click="closeMask">
					<view class="calendar-box" @click.stop="">
						<uni-calendar :lunar="tags[0].checked" :fixed-heihgt="tags[1].checked" :slide="slide" :disable-before="tags[6].checked" :start-date="startDate" :end-date="endDate" :date="date" @change="change" @to-click="toClick" />
						<view class="calendar-button-groups">
							<button class="calendar-button-confirm" @click="closeMask">取消</button>
							<button class="calendar-button-confirm" @click="confirm">确认</button>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">预约到访方式</view>
				<radio-group class="uni-list" name="linkType" @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in radioItems" :key="index">
						<view>
							<radio :id="item.name"  :value="item.name" :checked="item.checked"></radio>
						</view>
						<view>
							<label class="label-2-text" :for="item.name">
								<text>{{item.value}}</text>
							</label>
						</view>
					</label>
			</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="button-sp-area">
					<button type="primary"  formType="submit" plain="true">报名</button>
				</view>
			</view>
		</view>
		</x-form>
	
	</view>
</template>

<script>
	
 import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
 import {xForm} from "async-validator-uniapp";
 import {xInput} from "async-validator-uniapp";
 import {xCheckboxGroup} from "async-validator-uniapp";
 import {xCheckbox} from "async-validator-uniapp";
 import {xRadioGroup} from "async-validator-uniapp";
 import {xRadio} from "async-validator-uniapp";
 import {xPicker} from "async-validator-uniapp";
 import {xTextarea} from "async-validator-uniapp";
	export default {
		components: {
			uniCalendar,xForm,xInput,xCheckboxGroup,xCheckbox,xRadioGroup,xRadio,xPicker,xTextarea
		},
		data() {
				/**
			 * 时间计算
			 */
			function getDate(date, AddDayCount = 0) {
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				let dd = new Date(date)
				dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
				let y = dd.getFullYear()
				let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return y + '-' + m + '-' + d
			}
			
			let tags = [{
					id: 0,
					name: '农历',
					checked: false,
					attr: 'lunar'
				},
				{
					id: 1,
					name: '固定高度',
					checked: false,
					attr: 'fixedHeihgt'
				},
				{
					id: 2,
					name: '垂直滚动',
					checked: false,
					attr: 'vertical'
				},
				{
					id: 3,
					name: '水平滚动',
					checked: false,
					attr: 'horizontal'
				},
				{
					id: 4,
					name: '开始日期(' + getDate(new Date(), -1) + ')',
					checked: false,
					value: getDate(new Date(), -1),
					attr: 'startDate'
				},
				{
					id: 5,
					name: '结束日期(' + getDate(new Date(), 2) + ')',
					value: getDate(new Date(), 2),
					checked: false,
					attr: 'endDate'
				},
				{
					id: 6,
					name: '禁用今天之前的日期',
					checked: false,
					attr: 'disableBefore'
				},
				{
					id: 7,
					name: '自定义当前日期(' + getDate(new Date(), 1) + ')',
					value: getDate(new Date(), 1),
					checked: false,
					attr: 'date'
				}
			]
			return { 
				array: [{name:'1'},{name: '2'}, {name:'3'}, {name:'4'}, {name:'5'}, {name:'6'}],
				index: 0,
				radioItems: [{
						name: '1',
						value: '需要免费专车接送',
						checked: 'true'
					},
					{
						name: '2',
						value: '自驾（预约成功到访后可报销）',
						
					}
				],
				show: false,
				tags,
				slide: 'none',
				date: '',
				startDate: '',
				endDate: '',
				timeData: {},
				form:{
					customerName:"",
					mobile:""
				},
				rules:{
					customerName:[{
						required:true,
						messages:'请填写您的姓名'
					}],
					mobile:[{
						required:true,
						messages:"请填写您的手机号码"
					}]
				}
			}
		},
		methods: {
			radioChange(e) {
				var checked = e.target.value
				console.log(checked)
			},
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.index = e.target.value
			},
			closeMask() {
				this.show = false
			},
			toggle(index, item) {
				this.tags[index].checked = !item.checked
				// item.checked = !item.checked;
				console.log(index)
				if (index === 2) {
					this.tags[3].checked = false
				}
				if (index === 3) {
					this.tags[2].checked = false
				}
				// this.attribute[item.attr] = !item.checked;
			},
			open() {
				if (this.tags[3].checked) {
					this.slide = 'horizontal'
				} else if (this.tags[2].checked) {
					this.slide = 'vertical'
				} else {
					this.slide = 'none'
				}
				if (this.tags[4].checked) {
					this.startDate = this.tags[4].value
				} else {
					this.startDate = ''
				}
				if (this.tags[5].checked) {
					this.endDate = this.tags[5].value
				} else {
					this.endDate = ''
				}
				if (this.tags[7].checked) {
					this.date = this.tags[7].value
				} else {
					this.date = ''
				}
				this.show = true
				console.log(this.date)
			},
			change(e) {
				console.log('change 返回:', e.fulldate)
				this.timeData = e
			},
			toClick(e) {
				console.log('点击事件', e.fulldate)
				this.timeData = e
			},
			confirm() {
				this.show = false
			},
			formSubmit(e) {
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {
						console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e))
						uni.showToast({
						    title: "提交成功",
						    duration: 1000,
						});
						return;
					}
				});
				 
			},
		}
	}
</script>

<style>
	.uni-list-cell {
		justify-content: flex-start
	}

	.uni-list .label-3 {
		padding: 0;
	}
	
		page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}
	
	view {
		font-size: 28upx;
		line-height: inherit
	}
	
	.example {
		padding: 0 30upx 30upx
	}
	
	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}
	
	.example .example-title {
		margin: 40upx 0
	}
	
	.example-body {
		padding: 0 40upx
	}
	page {
		background: #fff;
	}
	.calendar-content {
		padding: 20upx 0;
		padding-bottom: 60upx;
		font-size: 26upx;
	}
	
	.calendar-content>.calendar-title {
		line-height: 80upx;
		/* font-weight: bold; */
		color: #666;
		font-size: 32upx;
		/* border-left: 2px #0d9ebb solid; */
		/* padding-left: 20upx; */
		margin: 0 20upx;
	}
	
	.calendar-tags-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 10upx;
	}
	
	.calendar-tags {
		width: 50%;
		box-sizing: border-box;
	}
	
	.calendar-tags-item {
		padding: 10upx 20upx;
		border: 1px rgba(0, 0, 0, 0.2) solid;
		color: #333;
		border-radius: 10upx;
		text-align: center;
		margin: 10upx;
		background: #f8f8f8;
	}
	
	.calendar-tags-item:active {
		background: #f8f8f8;
	}
	
	.checked .calendar-tags-item {
		background: rgb(0, 122, 255);
		color: #fff;
		border: 1px rgba(0, 0, 0, 0.1) solid;
	}
	
	.calendar-button {
		margin: 10upx 20upx;
	}
	
	.calendar-info {
		padding: 0 20upx;
	}
	
	.calendar-mask {
		position: fixed;
		/* #ifdef H5 */
		top: 45px;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		bottom: 0;
		display: flex;
		align-items: center;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);
		z-index: 99;
	}
	
	.calendar-box {
		/* margin: 20upx; */
		border: 1px #f5f5f5 solid;
		/* border-radius: 10upx; */
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}
	
	.calendar-button-groups {
		position: absolute;
		width: 100%;
		bottom: 0;
		display: flex;
	}
	
	.calendar-button-confirm {
		width: 50%;
		margin: 10upx;
		border: 1px #eee solid;
		font-size: 32upx;
	}
	
	.calendar-button-confirm:after {
		border: none;
	}
</style>
