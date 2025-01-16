import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import ProductManagement from '../../views/ProduktView.vue'

describe('ProductManagement', () => {
  beforeEach(() => {
    vi.mock('axios')
  })

  it('Produktliste laden', async () => {
    const products = [
      { id: 1, name: 'Product 1', price: 10.0, quantity: 5},
      { id: 2, name: 'Product 2', price: 20.0, quantity: 3}
    ]
    const suppliers = [
      { id: 1, name: 'Supplier 1' },
      { id: 2, name: 'Supplier 2' },
    ]
    vi.mocked(axios.get).mockResolvedValueOnce({ data: products})
    vi.mocked(axios.get).mockResolvedValueOnce({ data: suppliers})

    const wrapper = mount(ProductManagement)
    await flushPromises()


    expect(wrapper.findAll('tbody tr')).toHaveLength(products.length)
    expect(wrapper.text()).toContain('Product 1')
    expect(wrapper.text()).toContain('Product 2')
  })

  it('Info anzeigen, wenn Datenbank leer ist', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] })
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] })

    const wrapper = mount(ProductManagement)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Produkte hinzugefügt.')
  })

  it('Produkte hinzufügen', async () => {
    const newProduct = { name: 'New Product', price: 30.0, quantity: 10, supplierId: 1 }
    const mockSupplier = { id: 1, name: 'Supplier 1' }

    // Mock für die API-Aufrufe
    vi.mocked(axios.get)
      .mockResolvedValueOnce({ data: [] }) // Initiale Produktliste
      .mockResolvedValueOnce({ data: [mockSupplier] }) // Lieferantenliste
    vi.mocked(axios.post)
      .mockResolvedValueOnce({ data: { id: 3, ...newProduct } }) // Neues Produkt
      .mockResolvedValueOnce({}) // Warenbewegung

    // Komponente mounten
    const wrapper = mount(ProductManagement)
    await flushPromises()

    // Produkt-Hinzufügen-Modal öffnen
    await wrapper.find('.add-product-btn').trigger('click')

    // Felder ausfüllen
    await wrapper.find('#product-name').setValue(newProduct.name)
    await wrapper.find('#product-price').setValue(newProduct.price)
    await wrapper.find('#product-quantity').setValue(newProduct.quantity)
    await wrapper.find('#product-supplier').setValue(newProduct.supplierId)

    // Formular absenden
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    // Überprüfen, dass die richtige API für Produkte aufgerufen wurde
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      name: newProduct.name,
      price: newProduct.price,
      quantity: newProduct.quantity,
      supplierId: newProduct.supplierId,
    })

    // Überprüfen, dass die Warenbewegung erstellt wurde
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      productId: 3,
      produktName: newProduct.name,
      menge: newProduct.quantity,
      typ: 'Eingang',
      lieferant: mockSupplier,
      datum: expect.any(Array), // Prüfen, dass ein Datum übergeben wurde
    })

    // Überprüfen, dass das Produkt in der Tabelle angezeigt wird
    expect(wrapper.findAll('tbody tr')).toHaveLength(1) // Das erste Produkt
    expect(wrapper.text()).toContain(newProduct.name)
  })


  it('Produkt bearbeiten', async () => {
    const product = { id: 1, name: 'Product 1', price: 10.0, quantity: 5 }
    const updatedProduct = { name: 'Updated Product', price: 15.0, quantity: 7 }
    const suppliers = [
      { id: 1, name: 'Supplier 1' },
      { id: 2, name: 'Supplier 2' },
    ]

    vi.mocked(axios.get).mockResolvedValueOnce({ data: [product] })
    vi.mocked(axios.get).mockResolvedValueOnce({ data: suppliers })
    vi.mocked(axios.put).mockResolvedValueOnce({ data: { id: 1, ...updatedProduct } })

    const wrapper = mount(ProductManagement)
    await flushPromises()


    await wrapper.find('.edit-btn').trigger('click')

    await wrapper.find('#edit-product-name').setValue(updatedProduct.name)
    await wrapper.find('#edit-product-price').setValue(updatedProduct.price)
    await wrapper.find('#edit-product-quantity').setValue(updatedProduct.quantity)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/1'), updatedProduct)

    expect(wrapper.text()).toContain(updatedProduct.name)
  })
})
