    const icon = Buffer.from(item.icon, 'binary')
    const banner = Buffer.from(item.banner, 'binary')
    const pathsaveicon = `${item.name}_icon.png`
    const pathsavebanner = `${item.name}_banner.png`
    fs.writeFileSync(pathsaveicon, icon, 'binary')
    fs.writeFileSync(pathsavebanner, banner, 'binary')