package cl.dimade.catalog.category;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void shouldSaveCategory() {
        Category category = new Category();
        category.setName("Electronics");
        category.setDescription("Electronic devices");
        category.setSlug("electronics");

        Category savedCategory = categoryRepository.save(category);

        assertThat(savedCategory.getId()).isNotNull();
        assertThat(savedCategory.getName()).isEqualTo("Electronics");
    }

    @Test
    void shouldFindCategoryBySlug() {
        Category category = new Category();
        category.setName("Home");
        category.setSlug("home");
        categoryRepository.save(category);

        Optional<Category> found = categoryRepository.findBySlug("home");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Home");
    }
}
