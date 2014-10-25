/*

Currently No use. 
Contains code for the repeatable costum field


*/


jQuery('.repeatable-add').click(function() {
    field = jQuery(this).closest('td').find('.custom_repeatable li:last').clone(true);
    fieldLocation = jQuery(this).closest('td').find('.custom_repeatable li:last');
    jQuery('input', field).val('').attr('name', function(index, name) {
        return name.replace(/(\d+)/, function(fullMatch, n) {
            return Number(n) + 1;
        });
    })
    field.insertAfter(fieldLocation, jQuery(this).closest('td'))
    return false;
});
 
jQuery('.repeatable-remove').click(function(){
    jQuery(this).parent().remove();
    return false;
});
     
jQuery('.custom_repeatable').sortable({
    opacity: 0.6,
    revert: true,
    cursor: 'move',
    handle: '.sort'
});

    function ids(inputs) {
var a = [];
for (var i = 0; i < inputs.length; i++) {
a.push(inputs[i].val);
}
//$("span").text(a.join(" "));
    }
// repeatable fields
$('.meta_box_repeatable_add').live('click', function() {
// clone
var row = $(this).closest('.meta_box_repeatable').find('tbody tr:last-child');
var clone = row.clone();
clone.find('select.chosen').removeAttr('style', '').removeAttr('id', '').removeClass('chzn-done').data('chosen', null).next().remove();
clone.find('input.regular-text, textarea, select').val('');
clone.find('input[type=checkbox], input[type=radio]').attr('checked', false);
row.after(clone);
// increment name and id
clone.find('input, textarea, select')
.attr('name', function(index, name) {
return name.replace(/(\d+)/, function(fullMatch, n) {
return Number(n) + 1;
});
});
var arr = [];
$('input.repeatable_id:text').each(function(){ arr.push($(this).val()); });
clone.find('input.repeatable_id')
.val(Number(Math.max.apply( Math, arr )) + 1);
if (!!$.prototype.chosen) {
clone.find('select.chosen')
.chosen({allow_single_deselect: true});
}
//
return false;
});

$('.meta_box_repeatable_remove').live('click', function(){
$(this).closest('tr').remove();
return false;
});

$('.meta_box_repeatable tbody').sortable({
opacity: 0.6,
revert: true,
cursor: 'move',
handle: '.hndle'
});

// post_drop_sort
$('.sort_list').sortable({
connectWith: '.sort_list',
opacity: 0.6,
revert: true,
cursor: 'move',
cancel: '.post_drop_sort_area_name',
items: 'li:not(.post_drop_sort_area_name)',
        update: function(event, ui) {
var result = $(this).sortable('toArray');
var thisID = $(this).attr('id');
$('.store-' + thisID).val(result)
}
    });

$('.sort_list').disableSelection();

// turn select boxes into something magical
if (!!$.prototype.chosen)
$('.chosen').chosen({ allow_single_deselect: true });
});