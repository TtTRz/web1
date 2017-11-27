;(function($){
    var Poster = function(pro,setting){ 
        var _this = this;
        this.poster = pro;
        this.settingDOM();
        this.posterItems = this.poster.find('ul.poster-list');
        this.posterItemsLength = this.poster.find('ul.poster-list>li').length;
        this.posterFirstItem = this.poster.find('ul.poster-list>li:first-child');
        this.posterLastItem = this.poster.find('ul.poster-list>li:last-child');
        this.isEvenPicNum();
        this.prevBtn = this.poster.find('.poster-left-btn');
        this.nextBtn = this.poster.find('.poster-right-btn');

        this.prevBtn =  this.poster.find('div.poster-left-btn');
        this.nextBtn =  this.poster.find('div.poster-right-btn');
        this.rotateFlag = true;
        this.setting = setting ; /*or pro.attr();*/ 
        this.defaultSetting = {
            "width" : 800,             //Poster Total Width
            "height" : 234,             //Poster Total Height
            "posterFirstWidth" : 600,   //First Picture Width
            "posterFirstHeight" : 234,  //First Picture Height
            "autoPlay":false,
            "delay":5000,
            "scale" : 0.9,
            "speed" : 500,
            "verticalAlign" : "middle"
        };

        $.extend( this.defaultSetting , this.getCustomSetting());
        this.countSettingValue();
        this.setPositionValue();
        this.autoPlay();

        this.prevBtn.on('click', function(event) {
            if(_this.rotateFlag){
                _this.rotateFlag = false;
                _this.posterRotate('right') ;  
            }
        });
        this.nextBtn.on('click', function(event) {
            if(_this.rotateFlag){
                _this.rotateFlag = false;
                _this.posterRotate('left') ;  
            }
        });
    };

    Poster.prototype = {
        settingDOM : function (){
            var srcArr = this.poster.find('img').map(function(i,e){return e.src});
            var ulDOM = this.poster.html('<ul class="poster-list"></ul>').find('.poster-list');
            jQuery.each(srcArr , function(i,e){
                ulDOM.prepend('<li class="poster-item"><a href="javascript:void(0)"><img src="'+srcArr[i]+'" width="100%"></a></li>');
            });
            ulDOM.parents('.poster-main').append("<div class='poster-btn poster-left-btn'></div>").prepend("<div class='poster-btn poster-right-btn'></div>");
        },
        //是否带有自定义设置
        getCustomSetting : function(){
            var setting = this.setting ;
            if(setting && setting != ''){
                return setting;
            }else{
                return {};
            }
        },
        //设置默认值主要是为了当用户修改默认属性后CSS也相对调整
        countSettingValue : function(){

            this.poster.css({
                "width": this.defaultSetting.width,
                "height": this.defaultSetting.height
            });

            this.prevBtn.css({
                "width": (this.defaultSetting.width - this.defaultSetting.posterFirstWidth)/2,
                "height": this.defaultSetting.height
            });

            this.nextBtn.css({
                "width": (this.defaultSetting.width - this.defaultSetting.posterFirstWidth)/2,
                "height": this.defaultSetting.height
            });

            this.posterFirstItem.css({
                "left": (this.defaultSetting.width - this.defaultSetting.posterFirstWidth)/2,
                "zIndex": Math.floor(this.posterItemsLength/2)
            })

        },
        //设置默认加载进来时所有图片对应的位置
        setPositionValue : function(){
            var self = this ,
                level = Math.floor(this.posterItemsLength/2);
                items = this.poster.find('.poster-list > li').slice(1),
                leftItems = items.slice( 0 , items.length/2 ),
                rightItems = items.slice( items.length/2 ),
                optionImgLeft = (this.defaultSetting.width - this.defaultSetting.posterFirstWidth) / 2 ,
                gap = optionImgLeft / level,
                dw = this.defaultSetting.posterFirstWidth,
                dh = this.defaultSetting.posterFirstHeight;

            leftItems.each(function(i,e){
                dw *= self.defaultSetting.scale;
                dh *= self.defaultSetting.scale;
                var j = i ;
                $(e).css({
                    "width" : dw,
                    "height" : dh,
                    "zIndex" : --level, 
                    "opacity" : 1/(++j),
                    "left" : optionImgLeft + self.defaultSetting.posterFirstWidth + (++i) * gap - dw ,
                    "top" :  self.settingVerticalAlign(dh)
                })
            });

            var rw = leftItems.last().width(),
                rh = leftItems.last().height(),
            oloop = Math.floor(this.posterItemsLength/2);

            rightItems.each(function(i,e){

                $(e).css({
                    "width" : rw,
                    "height" : rh,
                    "zIndex" : level++, 
                    "opacity" : 1 / oloop--,
                    "left" : gap*i ,
                    "top" :  self.settingVerticalAlign(rh)
                })
                rw = rw / self.defaultSetting.scale;
                rh = rh / self.defaultSetting.scale;
            });

        },
        //设置垂直居中位置
        settingVerticalAlign : function(height){
            var verticalAlign = this.defaultSetting.verticalAlign,
                top;
            if( verticalAlign === 'middle' ){
                top = (this.defaultSetting.height - height) / 2;
            }else if( verticalAlign === 'top' ){
                top = 0;
            }else if( verticalAlign === 'bottom' ){
                top = (this.defaultSetting.height - height);
            }else{
                top = (this.defaultSetting.height - height) / 2;
            }
            return top;
        },
        //向左向右事件
        posterRotate : function(dir){
            var self = this ,
                indexArr = [];
            if(dir==='left'){
                this.posterItems.find('li').each(function(index, el) {
                    var prev = $(el).prev().get(0) ? $(el).prev() : self.posterLastItem,
                        width = prev.width(),
                        height = prev.height(),
                        zIndex = prev.css('zIndex'),
                        top = prev.css('top'),
                        left = prev.css('left'),
                        opacity = prev.css('opacity');
                        indexArr.push(zIndex);

                        $(el).animate({
                            width: width,
                            height: height,
                            //zIndex: zIndex,
                            top: top,
                            left: left,
                            opacity: opacity
                        },self.defaultSetting.speed,function(){
                            self.rotateFlag = true ;
                        });
                });
                //让z-index转化效果优先于别的提高交互
                this.posterItems.find('li').each(function(i){
                    $(this).css("zIndex",indexArr[i])
                })
            }else if(dir==='right'){
                this.posterItems.find('li').each(function(index, el) {
                    var next = $(el).next().get(0) ? $(el).next() : self.posterFirstItem,
                        width = next.width(),
                        height = next.height(),
                        zIndex = next.css('zIndex'),
                        top = next.css('top'),
                        left = next.css('left'),
                        opacity = next.css('opacity');
                        indexArr.push(zIndex);

                        $(el).animate({
                            width: width,
                            height: height,
                            //zIndex: zIndex,
                            top: top,
                            left: left,
                            opacity: opacity
                        },function(){
                            self.rotateFlag = true ;
                        });
                });
                this.posterItems.find('li').each(function(i){
                    $(this).css("zIndex",indexArr[i])
                })
            }
        },
        //是否自动播放
        autoPlay : function(){ 
            var self = this;
            if(this.defaultSetting.autoPlay){
                var timer = setInterval(function(){
                    self.posterRotate('left');
                } , self.defaultSetting.delay );

                this.poster.hover(function(){
                    clearTimeout(timer)
                },function(){
                    self.autoPlay();
                })
            }
        },
        //防止上传的图片数量为基数（通过后插入方式保持偶数图片数量）
        isEvenPicNum:function(){
            if(this.posterItemsLength%2 === 0){
                this.posterItems.append(this.posterFirstItem.clone());
                this.posterItemsLength = this.poster.find('ul.poster-list>li').length;
                this.posterFirstItem = this.poster.find('ul.poster-list>li:first-child');
                this.posterLastItem = this.poster.find('ul.poster-list>li:last-child');
            }
        }
    };

    Poster.init = function(pros,setting){
        var _this_ = this ;
        pros.each(function(i,e){ new _this_($(e),setting); });
        $(window).load(function(){ $('.poster-main').addClass('done'); })
    };

    window['Poster'] = Poster;

})(jQuery);