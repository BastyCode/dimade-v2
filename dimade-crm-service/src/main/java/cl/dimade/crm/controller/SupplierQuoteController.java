package cl.dimade.crm.controller;

import cl.dimade.crm.model.SupplierQuote;
import cl.dimade.crm.repository.SupplierQuoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crm/supplier-quotes")
public class SupplierQuoteController {

    @Autowired
    private SupplierQuoteRepository supplierQuoteRepository;

    @GetMapping
    public List<SupplierQuote> getAllQuotes() {
        return supplierQuoteRepository.findAll();
    }

    @PostMapping
    public SupplierQuote createQuote(@RequestBody SupplierQuote quote) {
        return supplierQuoteRepository.save(quote);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierQuote> getQuoteById(@PathVariable Long id) {
        return supplierQuoteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable Long id) {
        return supplierQuoteRepository.findById(id)
                .map(quote -> {
                    supplierQuoteRepository.delete(quote);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
