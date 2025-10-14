document.getElementById('cpf').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
    
    if (this.value.length > 14) {
        this.value = this.value.slice(0, 14);
    }
});