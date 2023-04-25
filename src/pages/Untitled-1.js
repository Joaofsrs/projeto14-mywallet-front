
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleForm}
                    required
                    const [form, setForma] = { name: "", email: "", password: "" }

    function handleForm(e) {
        setForma({ ...form, [e.target.name]: e.target.value });
    }