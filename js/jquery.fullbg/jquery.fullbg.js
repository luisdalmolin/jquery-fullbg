/*
 *  Project: jQuery FullBG
 *  Description: Plugin JS para criar um BG full size e auto ajustável conforme resoluções
 *  Author: Luís Dalmolin <luis@escape.ppg.br> 
 *  License: MIT 
 *  Version: 1.0
 */ 

;(function ( $, window, undefined ) {
    var FullBG = {
        /* init do plugin */ 
        init : function( options, element ) {
            var self     = this;

            self.element = element;
            self.options = $.extend( {}, $.fn.fullBG.options, options );

            /* divs */ 
            self.options.$box = $( self.element );
            self.options.$img = self.options.$box.find('img');

            /* resize da janela */ 
            $(window).on('resize', function() {
                self.resize();
            });

            /* iniciando o slider */ 
            if( self.options.transition ) {
                this.transition();
            }

            /* iniciando a navegação */ 
            if( self.options.nav ) {
                this.initNav();
            }

            self.resize();
        }, 

        /* pegando os tamanhos */ 
        getSizes : function() {
            this.options.innerWidth  = window.innerWidth;
            this.options.innerHeight = window.innerHeight;
        }, 

        /* resize das imagens */ 
        resize : function() {
            var self = this;
            self.getSizes();
            var size = self.ajust();

            console.log( size['width'] + ' | ' + size['height'] );

            self.options.$img.css({
                'width'  : size['width'], 
                'height' : size['height'], 
                'left'   : size['left']
            });

            var arguments = [ self.options.innerWidth, self.options.innerHeight ];

            /* verificando se o onWindowChange é uma função */ 
            if( typeof self.options.onWindowChange === 'function' ) {
                self.options.onWindowChange.apply( self.element, arguments );
            }
        }, 

        /* ajustando o tamanho das imagens */ 
        ajust : function() {
            var size = [];
            size['width']  = 'auto';
            size['height'] = 'auto';       
            size['left']   = 0;
            
            var widthRatio  = this.options.innerWidth  / this.options.imageWidth, 
                heightRatio = this.options.innerHeight / this.options.imageHeight, 
                left        = 0;

            if( widthRatio > heightRatio )
            {
                var tempHeight = this.options.imageHeight * widthRatio;

                size['width']  = this.options.innerWidth;
                size['height'] = tempHeight;
                size['left']   = left;
            }
            else
            {
                var tempWidth = this.options.imageWidth * heightRatio;
                var left      = ( tempWidth - this.options.innerWidth ) / 2;

                size['height'] = this.options.innerHeight;
                size['width']  = tempWidth;
                size['left']   = '-' + left + 'px';
            }

            return size;
        }, 

        /* transição das imagens */ 
        transition : function() {
            var self = this;         
            self.options.totalImgs = self.options.$img.size();

            self.initInterval();
        }, 

        initInterval : function() {
            var self = this;

            self.interval = window.setInterval(function() {
                self.switchImg();
            }, self.options.delay);
        }, 

        restartInterval : function() {
            var self = this;

            window.clearInterval( self.interval );

            self.initInterval();
        }, 

        /* alterando a imagem */ 
        switchImg : function() {
            this.options.imgAtual++;
            if( this.options.imgAtual > this.options.totalImgs ) {
                this.options.imgAtual = 1;
            }

            /* fade out */ 
            this.options.$img
            .fadeOut( this.options.speed );
            
            /* fade in */ 
            this.options.$img
            .slice( this.options.imgAtual - 1, this.options.imgAtual )
            .fadeIn( this.options.speed );

            /* nav */ 
            if( this.options.nav ) {
                this.switchMenuAtual();
            }
        }, 

        switchMenuAtual : function() {
            var self = this;

            self.options.$navItem.removeClass('full-bg-nav-active');
            $('#full-bg-nav-item-' + self.options.imgAtual).addClass('full-bg-nav-active');
        }, 

        initNav : function() {
            var self = this;

            self.options.$nav = $('<ul class="' + self.options.$nav.replace('.', '') + '"></ul>');
            self.options.$box.append( self.options.$nav );

            this.setMenuLinks();
        }, 

        setMenuLinks : function() {
            var id   = 1, 
                self = this;

            self.options.$img.each(function() {
                var $this = $(this), 
                    $temp = $('<li><a href="#full-bg-nav-'+id+'" class="full-bg-nav-item" id="full-bg-nav-item-'+id+'">'+id+'</a></li>');

                self.options.$nav.append( $temp );
                $this.attr('id', 'full-bg-img-' + id);
                id++;
            });

            self.options.$navItem = self.options.$nav.find( self.options.$navItem );
            self.options.$navItem.on('click', function(e) {
                e.preventDefault();
                
                var $this = $(this), 
                    idImg = $this.attr('id').split('-')[4];

                self.options.imgAtual = idImg;

                /* imagens */ 
                self.options.$img.fadeOut( self.options.speed );
                $('#full-bg-img-' + idImg).fadeIn( self.options.speed );

                /* alterando o menu atual */ 
                self.switchMenuAtual();

                self.restartInterval();
            });

            /* setando como ativo **/ 
            self.switchMenuAtual();
        }
    }

    $.fn.fullBG = function( options ) {
        return this.each(function() {
            var fullBG = Object.create( FullBG );
            
            fullBG.init( options, this );

            $.data( this, 'fullBG', fullBG );
        });
    };

    /* defaults */ 
    $.fn.fullBG.options = {
        $box           : null, 
        $img           : '.full-bg-img', 
        $nav           : '.full-bg-nav', 
        $navItem       : '.full-bg-nav-item', 
        imageWidth     : 1500, 
        imageHeight    : 750, 
        transition     : true, 
        delay          : 5000, 
        speed          : 500, 
        imgAtual       : 1, 
        nav            : true, 
        onWindowChange : null
    }

}(jQuery, window));