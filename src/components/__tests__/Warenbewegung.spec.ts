/*
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import WarenbewegungView from '../../views/Warenbewegung.vue'

describe('WarenbewegungView', () => {
  beforeEach(() => {
    vi.mock('axios')
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('should load products, customers, and suppliers on mounted', async () => {
    const products = [{ id: 1, name: 'Product 1', quantity: 10 }]
    const customers = [{ id: 1, name: 'Customer 1' }]
    const suppliers = [{ id: 1, name: 'Supplier 1' }]

    vi.mocked(axios.get).mockResolvedValueOnce({ data: products })
    vi.mocked(axios.get).mockResolvedValueOnce({ data: customers })
    vi.mocked(axios.get).mockResolvedValueOnce({ data: suppliers })

    const wrapper = shallowMount(WarenbewegungView)
    await flushPromises()

    expect(wrapper.vm.produkte).toEqual(products)
    expect(wrapper.vm.kunden).toEqual(customers)
    expect(wrapper.vm.lieferanten).toEqual(suppliers)
  })

  it('should handle incoming stock booking', async () => {
    const product = { id: 1, name: 'Product 1' }
    const supplier = { id: 1, name: 'Supplier 1' }
    const quantity = 5

    vi.mocked(axios.put).mockResolvedValueOnce({ status: 200 })

    const wrapper = shallowMount(WarenbewegungView)
    wrapper.vm.selectedProduct = product
    wrapper.vm.selectedLieferant = supplier
    wrapper.vm.quantity = quantity

    await wrapper.vm.bookIncoming()

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/1/entry?quantityToAdd=5&lieferantId=1`),
      {}
    )
    expect(wrapper.vm.selectedProduct).toBeNull()
    expect(wrapper.vm.selectedLieferant).toBeNull()
    expect(wrapper.vm.quantity).toBe(1)
    expect(window.alert).toHaveBeenCalledWith(
      `Wareneingang für Product 1 von Supplier 1 erfolgreich gebucht!`
    )
  })

  it('should handle outgoing stock booking', async () => {
    const product = { id: 1, name: 'Product 1' }
    const customer = { id: 1, name: 'Customer 1' }
    const quantity = 5

    vi.mocked(axios.put).mockResolvedValueOnce({ status: 200 })

    const wrapper = shallowMount(WarenbewegungView)
    wrapper.vm.selectedProduct = product
    wrapper.vm.selectedKunde = customer
    wrapper.vm.quantity = quantity

    await wrapper.vm.bookOutgoing()

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/1/exit?quantityToExit=5&kundeId=1`),
      {}
    )
    expect(wrapper.vm.selectedProduct).toBeNull()
    expect(wrapper.vm.selectedKunde).toBeNull()
    expect(wrapper.vm.quantity).toBe(1)
    expect(window.alert).toHaveBeenCalledWith(
      `Warenausgang für Product 1 an Customer 1 erfolgreich gebucht!`
    )
  })

  it('should show alert if no product, customer, or quantity selected when booking outgoing', async () => {
    const wrapper = shallowMount(WarenbewegungView)
    wrapper.vm.selectedProduct = null
    wrapper.vm.selectedKunde = null
    wrapper.vm.quantity = 0

    await wrapper.vm.bookOutgoing()

    expect(window.alert).toHaveBeenCalledWith(
      'Bitte ein Produkt, einen Kunden und eine gültige Menge auswählen.'
    )
  })

  it('should show alert if no product, supplier, or quantity selected when booking incoming', async () => {
    const wrapper = shallowMount(WarenbewegungView)
    wrapper.vm.selectedProduct = null
    wrapper.vm.selectedLieferant = null
    wrapper.vm.quantity = 0

    await wrapper.vm.bookIncoming()

    expect(window.alert).toHaveBeenCalledWith(
      'Bitte ein Produkt, einen Lieferanten und eine gültige Menge auswählen.'
    )
  })

  it('should delete a stock movement successfully', async () => {
    const movement = { id: 1 }
    vi.mocked(axios.delete).mockResolvedValueOnce({ status: 204 })

    const wrapper = shallowMount(WarenbewegungView)
    await wrapper.vm.deleteWarenbewegung(movement.id)

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/warenbewegungen/1')
    )
    expect(window.alert).toHaveBeenCalledWith('Warenbewegung erfolgreich gelöscht!')
  })

  it('should handle error when deleting a stock movement', async () => {
    const movement = { id: 1 }
    vi.mocked(axios.delete).mockRejectedValueOnce(new Error('Error deleting'))

    const wrapper = shallowMount(WarenbewegungView)
    await wrapper.vm.deleteWarenbewegung(movement.id)

    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/warenbewegungen/1')
    )
    expect(window.alert).toHaveBeenCalledWith(
      'Fehler beim Löschen der Warenbewegung: Error deleting'
    )
  })
})
*/
