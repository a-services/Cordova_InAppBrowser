var iabOptionsProperty = 'iab_options';

function updateOptions(value) {
    localStorage.setItem(iabOptionsProperty, value);
}

function getOptions() {
    return (localStorage.getItem(iabOptionsProperty) || 'location=no,beforeload=yes').trim();
}