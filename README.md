# jQuery FullBG

Plugin jQuery para deixar as imagens de fundo utilizando sempre o tamanho máximo possível, se encaixando na resolução necessária.

## Usage
{{{
<div class="full-bg" id="full-bg">
    <img src="img/bg-1.jpg" class="full-bg-img" />
    <img src="img/bg-2.jpg" class="full-bg-img full-bg-img-hidden" />
    <img src="img/bg-3.jpg" class="full-bg-img full-bg-img-hidden" />
</div>

<script>
    $(function() {
        $('.full-bg').fullBG();
    });
</script>
}}}

## Exmplos 
- Exemplo pode ser visto no [Github Pages](http://luisdalmolin.github.com/jquery-fullbg/)