export const formItemConfigMap = new Map([
  [
    "title",
    {
      label: "枪支弹药配备情况",
      prop: "qzdypbqk",
      type: "title"
    }
  ],
  [
    "input",
    {
      label: "备注**",
      prop: "memo",
      type: "textarea",
      placeholder: "请输入****",
      maxlength: 200,
      disabled: false,
      rules: {
        requiredMsg: "****不能为空",
        required: false
      }
    }
  ],
  [
    "dict",
    {
      label: "是否存在*****",
      prop: "isShow",
      type: "radio",
      typeId: "012",
      width: "50%",
      disabled: false,
      rules: {
        requiredMsg: "请选择是否存在*****",
        required: true
      }
    }
  ],
  [
    "date",
    {
      label: "日期",
      prop: "startDate",
      type: "date",
      placeholder: "请选择日期",
      disabled: false,
      rules: {
        requiredMsg: "日期不能为空",
        required: true
      }
    }
  ],
  [
    "file",
    {
      label: "走访登记表 ",
      prop: "hdFileZfdjb",
      type: "file",
      maxCount: 10,
      disabled: false,
      rules: {
        requiredMsg: "请上传走访登记表",
        required: true
      },
      vIf: [
        {
          label: "hdArrayZdrylx",
          value: ["070000000000"]
        }
      ]
    }
  ],
  [
    "button",
    {
      prop: "qzdypbqk",
      label: "枪支弹药配备情况",
      type: "title"
    }
  ]
]);
