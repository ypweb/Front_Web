/**
name:credit_manage / rules;
 author:yipin;
 date:2016-06-07;
 version:1.0.0**/
define({email:/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z0-9]{2,7}((\.[a-z]{2})|(\.(com|net)))?)$/,mobilephone:/^(13[0-9]|15[012356789]|18[0-9]|14[57]|170)[0-9]{8}$/,num:/^[0-9]{0,}$/g,pointnum:/^(([0-9]{1}\d{0,})|0)((\.{0}(\d){0})|(\.{1}(\d){1,}))$/,username:/^[0-9A-Za-z_\u2E80-\u9FFF]{4,16}$/,moneyy:/^(([1-9]{1}\d{0,8})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,moneyqw:/^(([1-9]{1}\d{0,7})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,moneybw:/^(([1-9]{1}\d{0,6})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,moneysw:/^(([1-9]{1}\d{0,5})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,moneyw:/^(([1-9]{1}\d{0,4})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,moneyq:/^(([1-9]{1}\d{0,3})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,moneyb:/^(([1-9]{1}\d{0,2})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,money:/^(([1-9]{1}\d{0,})|0)((\.{0}(\d){0})|(\.{1}(\d){2}))$/,injections:/[%--`~#$^&*()=|{}\[\]<>\/~@#&*——|{}【】‘']/gi,injection:/[%--`~#$^&*()=|{}\[\]<>\/~@#&*——|{}【】‘']/i,allspace:/^\s*\s*$/,brmoz:/^(\s*|&nbsp;*|[\s|&nbsp;]*)(<br|<\/br|<br>|<\/br>)+$/,brwebkit:/^(((<div>)*(<br|<\/br|<br>|<\/br>)*(<\/div>)*)+)$/,editspace:/(\s|(&nbsp;)|\n|\r|\v)/g});