package cl.dimade.crm.repository;

import cl.dimade.crm.model.SupplierQuote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierQuoteRepository extends JpaRepository<SupplierQuote, Long> {
    List<SupplierQuote> findBySupplierId(Long supplierId);
}
